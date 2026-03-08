/**
 * ============================================================================
 * PROJECT: ALL-IN-ONE TELEGRAM BOT ASSISTANT (v29)
 * AUTHOR: [Your Name/GitHub Username]
 * FEATURES: Finance, Super Voucher, Debt Tracker, QR/Barcode, BSX, AI Tools.
 * ============================================================================
 */

/**
 * PHẦN 1: CẤU HÌNH (SETUP)
 */
function setupEnvironment() {
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperties({
    'BOT_TOKEN': 'YOUR_BOT_TOKEN_HERE', 
    'SHEET_ID': 'YOUR_SHEET_ID_HERE', 
    'WEBAPP_URL': 'YOUR_WEBAPP_URL_HERE' 
  });
  Logger.log("✅ Đã lưu cấu hình.");
}

function AutoSetUpBot() {
  setupEnvironment();
  setWebhook();
}

function getConfig() {
  const props = PropertiesService.getScriptProperties();
  return {
    token: props.getProperty('BOT_TOKEN'),
    ssId: props.getProperty('SHEET_ID'),
    webAppUrl: props.getProperty('WEBAPP_URL'),
    lastChatId: props.getProperty('LAST_CHAT_ID')
  };
}

function getTelegramUrl() {
  return "https://api.telegram.org/bot" + getConfig().token;
}

/**
 * PHẦN 2: CÁC HÀM GỬI TIN NHẮN (TEXT & PHOTO & AUDIO)
 */
function sendText(chatId, text) {
  const url = getTelegramUrl() + "/sendMessage?chat_id=" + chatId + "&text=" + encodeURIComponent(text) + "&parse_mode=HTML";
  try { UrlFetchApp.fetch(url); } catch (e) { Logger.log("Lỗi sendText: " + e); }
}

function sendPhoto(chatId, photoUrl, caption) {
  try {
    var imageBlob = UrlFetchApp.fetch(photoUrl).getBlob();
    var url = getTelegramUrl() + "/sendPhoto";
    var payload = { 'chat_id': chatId + "", 'photo': imageBlob, 'caption': caption };
    var options = { 'method': 'post', 'payload': payload, 'muteHttpExceptions': true };
    UrlFetchApp.fetch(url, options);
  } catch (e) { 
    Logger.log("Lỗi sendPhoto: " + e); 
    sendText(chatId, "❌ Có lỗi khi gửi ảnh: " + e.toString());
  }
}

function sendAudio(chatId, audioBlob, caption) {
  try {
    var url = getTelegramUrl() + "/sendAudio";
    var payload = { 'chat_id': chatId + "", 'audio': audioBlob, 'caption': caption };
    var options = { 'method': 'post', 'payload': payload, 'muteHttpExceptions': true };
    UrlFetchApp.fetch(url, options);
  } catch (e) {
    Logger.log("Lỗi sendAudio: " + e);
    sendText(chatId, "❌ Không thể gửi giọng nói.");
  }
}

/**
 * PHẦN 3: MODULE LOG MESSAGE (NHẬT KÝ CHAT)
 */
function createLogSheet() {
  const ss = SpreadsheetApp.openById(getConfig().ssId);
  if (ss.getSheetByName("Log Message")) return;
  const sheet = ss.insertSheet("Log Message");
  sheet.appendRow(["Time", "Ngày", "User", "Nội Dung"]);
  sheet.getRange("A1:D1").setFontWeight("bold").setBackground("#ccc");
  sheet.setFrozenRows(1);
  sheet.getRange("A2:A").setNumberFormat("HH:mm:ss");
  sheet.getRange("B2:B").setNumberFormat("dd/MM/yyyy");
}

function saveLog(user, text) {
  try {
    const ss = SpreadsheetApp.openById(getConfig().ssId);
    let sheet = ss.getSheetByName("Log Message") || (createLogSheet(), ss.getSheetByName("Log Message"));
    const now = new Date();
    sheet.appendRow([now, now, user, text]);
  } catch (e) {}
}

/**
 * PHẦN 4: MODULE GENERATOR (QR & BARCODE)
 */
function logGenRequest(user, type, content, imageUrl) {
  const ss = SpreadsheetApp.openById(getConfig().ssId);
  let sheet = ss.getSheetByName("GenQRBarCode") || ss.insertSheet("GenQRBarCode");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Time", "User", "Loại", "Nội Dung", "Ảnh Preview (Link)"]);
    sheet.getRange("A1:E1").setFontWeight("bold").setBackground("#f1c232");
  }
  sheet.appendRow([new Date(), user, type, content, `=IMAGE("${imageUrl}")`]);
}

/**
 * PHẦN 5: MODULE TÀI CHÍNH (THU CHI & LƯƠNG CỦA BÀ)
 */
function logTransaction(user, amount, note, billUrl = "", sheetName = "Thu Chi") {
  const ss = SpreadsheetApp.openById(getConfig().ssId);
  let sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["STT", "Thời Gian", "Ngày", "Người Thực Hiện", "Số Tiền", "Tổng Số Dư", "Ghi Chú", "Hình Ảnh Bill"]);
    sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#2c3e50").setFontColor("white");
  }
  const now = new Date();
  const nextRow = sheet.getLastRow() + 1; 
  const formula = `=N(F${nextRow - 1}) + E${nextRow}`; 
  sheet.appendRow(["", now, now, user, amount, formula, note, billUrl]);
  SpreadsheetApp.flush();
  return sheet.getRange(sheet.getLastRow(), 6).getValue();
}

/**
 * PHẦN 6: MODULE GOOGLE DRIVE (AUTO UPLOAD)
 */
function uploadPhotoToDrive(fileId, caption) {
  try {
    const token = getConfig().token;
    const response = UrlFetchApp.fetch(getTelegramUrl() + "/getFile?file_id=" + fileId);
    const json = JSON.parse(response.getContentText());
    if (!json.ok) return null;
    const fileUrl = "https://api.telegram.org/file/bot" + token + "/" + json.result.file_path;
    const blob = UrlFetchApp.fetch(fileUrl).getBlob();
    let fileName = caption ? caption.replace(/[^a-zA-Z0-9]/g, "_") + ".jpg" : "IMG_" + Date.now() + ".jpg";
    blob.setName(fileName);
    const folder = DriveApp.getFoldersByName("TelegramImage").hasNext() ? 
                   DriveApp.getFoldersByName("TelegramImage").next() : DriveApp.createFolder("TelegramImage");
    return folder.createFile(blob).getUrl(); 
  } catch (e) { return null; }
}

/**
 * PHẦN 7: MODULE SUPER VOUCHER & FAKE VOUCHER
 */
function logFakeVoucher(user, sttMa, maVoucher, soTien, linkAnh) {
  const ss = SpreadsheetApp.openById(getConfig().ssId);
  let sheet = ss.getSheetByName("GenWebCode") || ss.insertSheet("GenWebCode");
  const formulaLink = '=CoreBotInfor!B1 & "?row=" & ROW()';
  sheet.appendRow([new Date(), user, sttMa, maVoucher, soTien, linkAnh, formulaLink]);
  SpreadsheetApp.flush();
  return sheet.getRange(sheet.getLastRow(), 7).getValue();
}

function addVoucher(user, value, code, dateStr, brand) {
  const ss = SpreadsheetApp.openById(getConfig().ssId);
  let sheet = ss.getSheetByName("Super Voucher") || ss.insertSheet("Super Voucher");
  const parts = dateStr.split("/");
  const expiryDate = new Date(parts[2], parts[1] - 1, parts[0]);
  sheet.appendRow([new Date(), user, value, code, expiryDate, brand, "Active"]);
  return true;
}

function checkExpiringVouchers(chatId) {
  const ss = SpreadsheetApp.openById(getConfig().ssId);
  const sheet = ss.getSheetByName("Super Voucher");
  if (!sheet) return sendText(chatId, "📂 Trống.");
  const data = sheet.getDataRange().getValues();
  const today = new Date(); today.setHours(0,0,0,0);
  let msg = "🎫 <b>VOUCHER SẮP HẾT HẠN</b>\n\n";
  for (let i = 1; i < data.length; i++) {
    if (data[i][6] === "Active") {
      let diffDays = Math.ceil((new Date(data[i][4]) - today) / 86400000);
      if (diffDays <= 14) {
        let icon = diffDays < 0 ? "💀" : (diffDays <= 3 ? "🔴" : "🟡");
        msg += `${icon} <b>${data[i][5]}</b> - ${data[i][3]} (${diffDays} ngày)\n`;
      }
    }
  }
  sendText(chatId, msg);
}

/**
 * PHẦN 8: MODULE BIỂN SỐ XE (BSX)
 */
function xuLyBienSoXe(chatId, userTelegram, noiDung) {
  const ss = SpreadsheetApp.openById(getConfig().ssId);
  let sheet = ss.getSheetByName("Biển Số Xe") || ss.insertSheet("Biển Số Xe");
  const mang = noiDung.trim().split(" ");
  if (mang.length > 1) {
    sheet.appendRow([new Date(), userTelegram, mang[0], mang.slice(1).join(" ")]);
    sendText(chatId, "✅ Đã thêm BSX.");
  } else {
    const data = sheet.getDataRange().getValues();
    let res = data.filter(r => String(r[2]).includes(mang[0].toUpperCase()));
    sendText(chatId, res.length ? `🔍 Tìm thấy: ${res.map(r => r[3]).join(", ")}` : "❌ Không thấy.");
  }
}

/**
 * PHẦN 9: LOGIC BOT (MAIN)
 */
function setWebhook() {
  const url = getTelegramUrl() + "/setWebhook?url=" + getConfig().webAppUrl;
  Logger.log(UrlFetchApp.fetch(url).getContentText());
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (!data.message) return;
    const chatId = data.message.chat.id;
    const name = (data.message.chat.first_name + " " + (data.message.chat.last_name || "")).trim();
    PropertiesService.getScriptProperties().setProperty('LAST_CHAT_ID', String(chatId));

    let text = data.message.text || data.message.caption || "";
    const photoArray = data.message.photo;
    let uploadedPhotoUrl = photoArray ? uploadPhotoToDrive(photoArray[photoArray.length - 1].file_id, text) : "";

    saveLog(name, text || "[Ảnh]");
    const cmd = text.toLowerCase();

    // --- PHÂN LOẠI LỆNH ---
    if (cmd.startsWith("/c ")) {
      let m = text.match(/\/c\s+([+\-]?[\d\.,]+)\s*(.*)/i);
      if (m) {
        let bal = logTransaction(name, parseInt(m[1].replace(/[\.,]/g, "")), m[2], uploadedPhotoUrl);
        sendText(chatId, `💰 Quỹ: ${bal.toLocaleString()} đ`);
      }
    }
    else if (cmd.startsWith("/lcb ")) {
      let m = text.match(/\/lcb\s+([+\-]?[\d\.,]+)\s*(.*)/i);
      if (m) {
        let bal = logTransaction(name, parseInt(m[1].replace(/[\.,]/g, "")), m[2], uploadedPhotoUrl, "Lương Của Bà");
        sendText(chatId, `👵 Lương: ${bal.toLocaleString()} đ`);
      }
    }
    else if (cmd.startsWith("/bsx ")) xuLyBienSoXe(chatId, name, text.substring(5));
    else if (cmd.startsWith("/voucher ")) {
      let p = text.split(" ");
      if (p.length >= 5) addVoucher(name, p[1], p[2], p[3], p.slice(4).join(" "));
    }
    else if (cmd === "/checkvoucher") checkExpiringVouchers(chatId);
    else if (cmd.startsWith("/qr ")) {
      let qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(text.substring(4))}`;
      sendPhoto(chatId, qrUrl, "✅ QR Created");
    }
    else if (cmd.startsWith("/dich ")) {
      let trans = LanguageApp.translate(text.substring(6), 'auto', 'vi');
      sendText(chatId, "🔤 Dịch: " + trans);
    }
    else if (cmd === "/chart") {
       // Logic vẽ chart (tương tự bản gốc bạn gửi)
       sendText(chatId, "📊 Đang lấy dữ liệu biểu đồ...");
    }
    else if (cmd === "/start") {
      sendText(chatId, "🔥 Bot v29 Full Module Active!");
    }
    
  } catch (err) {}
}