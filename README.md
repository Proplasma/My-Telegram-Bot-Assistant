## README: Telegram Multi-Purpose Assistant Bot
//////////////////////ENGLISH BELOW///////////////////////////////////




---

## README: Hệ Thống Bot Trợ Lý Đa Năng Telegram

Tài liệu này cung cấp cái nhìn toàn diện về Hệ thống Bot Trợ lý Đa năng Telegram (phiên bản v29), một giải pháp tích hợp để quản lý tài chính, theo dõi mã giảm giá và tự động hóa các tiện ích dựa trên nền tảng Google Apps Script và Google Sheets.

---

### Tổng Quan Dự Án

Bot Trợ lý Đa năng Telegram được thiết kế để đóng vai trò là trung tâm quản lý dữ liệu cá nhân. Bằng cách tận dụng API của Telegram Bot và các dịch vụ của Google Workspace, hệ thống cho phép người dùng thực hiện các tác vụ nhập và truy xuất dữ liệu phức tạp thông qua các câu lệnh trò chuyện đơn giản. Hệ thống được tối ưu hóa để có tính sẵn sàng cao và chi phí vận hành bằng không.

---

### Công Nghệ Sử Dụng

* **Ngôn ngữ**: Google Apps Script (dựa trên nền tảng JavaScript).
* **Cơ sở dữ liệu**: Google Sheets (Trình quản lý bảng tính).
* **Lưu trữ**: Google Drive (dùng để sao lưu tệp tin đa phương tiện tự động).
* **Giao diện lập trình ứng dụng (API)**:
* API Telegram Bot.
* Google LanguageApp (Dùng cho chức năng dịch thuật).
* QuickChart API (Dùng cho báo cáo trực quan).
* Bwip-js (Dùng để tạo mã vạch).



---

### Các Tính Năng Chính và Quy Trình Hoạt Động

#### 1. Quản lý Tài chính

Người dùng có thể ghi chép thu nhập và chi phí vào các sổ cái cụ thể. Bot hỗ trợ hai quỹ chính: Quỹ Chung và Lương Của Bà.

* **Quy trình**: Khi một giao dịch được gửi kèm ảnh, bot sẽ tải hình ảnh lên một thư mục được chỉ định trên Google Drive và ghi lại liên kết tệp tin cùng với dữ liệu giao dịch vào bảng tính.

#### 2. Hệ thống Super Voucher

Đây là mô-đun quản lý dùng để theo dõi các mã giảm giá và ngày hết hạn của chúng.

* **Quy trình**: Người dùng thêm voucher với ngày hết hạn cụ thể. Bot cung cấp lệnh kiểm tra để liệt kê các voucher hết hạn trong vòng 14 ngày và hỗ trợ trình kích hoạt tự động hàng ngày để thông báo cho người dùng về các mã sắp hết hạn.

#### 3. Theo dõi Công nợ

Một mô-đun chuyên dụng để ghi chép và giám sát các khoản nợ cá nhân.

* **Quy trình**: Các khoản nợ được ghi lại theo tên và số tiền. Người dùng có thể lọc danh sách theo tên người nợ hoặc xóa các mục sau khi đã thanh toán xong.

#### 4. Các Công cụ Tiện ích

* **Tạo mã QR/Mã vạch**: Chuyển đổi văn bản sang nhiều định dạng mã khác nhau.
* **Quản lý Biển số xe**: Lưu trữ và truy xuất thông tin chủ xe.
* **Dịch thuật và Giọng nói AI**: Dịch văn bản hoặc chuyển đổi văn bản thành giọng nói.

---

### Cài đặt và Thiết lập

1. **Tạo Bot**: Tạo một bot mới thông qua @BotFather trên Telegram để nhận Mã Token API.
2. **Chuẩn bị Cơ sở dữ liệu**: Tạo một bảng tính Google Sheet và sao chép ID của nó từ đường dẫn URL.
3. **Triển khai Mã nguồn**:
* Mở Google Sheet, chọn Tiện ích mở rộng, sau đó chọn Apps Script.
* Dán mã nguồn đã được cung cấp vào trình chỉnh sửa.
* Chạy hàm `setupEnvironment` một lần để khởi tạo Token, ID bảng tính và URL ứng dụng Web của bạn.
* Triển khai tập lệnh dưới dạng Ứng dụng Web (Quyền truy cập: Mọi người).


4. **Kích hoạt Webhook**: Chạy hàm `setWebhook` để kết nối tập lệnh của bạn với API Telegram.

---

### Tài liệu về Câu lệnh

#### Lệnh Tài chính

* **Quỹ Chung**: `/c [số tiền] [nội dung]` (Đính kèm ảnh để lưu hóa đơn).
* **Quỹ Lương**: `/lcb [số tiền] [nội dung]` (Đính kèm ảnh để lưu hóa đơn).

#### Lệnh Voucher

* **Thêm**: `/voucher [giá trị] [mã] [ngày/tháng/năm] [thương hiệu]`.
* **Kiểm tra**: `/checkvoucher` (Liệt kê các mã hết hạn trong dưới 14 ngày).
* **Sử dụng**: `/use [mã]` (Đánh dấu mã đã được sử dụng).

#### Lệnh Nợ

* **Ghi lại**: `/n [số tiền] [tên] [ghi chú]`.
* **Xem**: `/nlist` hoặc `/nlist [tên]`.
* **Xóa**: `/ndelete [số thứ tự]`.

#### Lệnh Tiện ích

* **Mã QR**: `/qr [nội dung]`.
* **Biển số xe**: `/bsx [biển số]` hoặc `/bsx [biển số] [tên chủ xe]`.
* **Dịch**: `/dich [văn bản]`.

---

### Ví dụ Tin nhắn và Phản hồi của Bot

**Người dùng nhập (Tài chính):**
`/c -50000 Bữa trưa` (kèm hình ảnh)

**Bot phản hồi:**
`[QUỸ CHUNG]`
`CHI TIÊU: 50,000 VND`
`GHI CHÚ: Bữa trưa`
`SỐ DƯ: 1,450,000 VND`
`Đã đính kèm hóa đơn thành công`

---

**Người dùng nhập (Kiểm tra Voucher):**
`/checkvoucher`

**Bot phản hồi:**
`DANH SÁCH VOUCHER SẮP HẾT HẠN`
`Tên Thương Hiệu (Giá trị)`
`Mã: CODE123`
`Hết hạn: 15/03/2026 (Còn lại 3 ngày)`

---

### Bảo mật và Xử lý Dữ liệu

Bot sử dụng `PropertiesService` để lưu trữ các thông tin xác thực nhạy cảm. Tất cả các tệp tin đa phương tiện được tải lên qua trò chuyện được lưu trữ trong một thư mục riêng tư trên Google Drive có tên "TelegramImage". Người dùng nên giữ bảng tính và thư mục Drive ở chế độ riêng tư.






**English**

This document provides a comprehensive overview of the Telegram Multi-Purpose Assistant Bot (v29), an integrated solution for financial management, voucher tracking, and utility automation leveraging Google Apps Script and Google Sheets.

---

### Project Overview

The Telegram Multi-Purpose Assistant Bot is designed to serve as a centralized hub for personal data management. By utilizing the Telegram Bot API and Google Workspace services, it allows users to perform complex data entry and retrieval tasks through simple chat commands. The system is optimized for high availability and zero-cost hosting.

---

### Technical Stack

* **Language**: Google Apps Script (JavaScript based).
* **Database**: Google Sheets.
* **Storage**: Google Drive (for automated media backups).
* **APIs**:
* Telegram Bot API.
* Google LanguageApp (Translation).
* QuickChart API (Visual reporting).
* Bwip-js (Barcode generation).



---

### Key Features and Workflow

#### 1. Financial Management

Users can log income and expenses to specific ledgers. The bot supports two primary funds: General Fund (Quỹ Chung) and Grandmother's Salary (Lương Của Bà).

* **Workflow**: When a transaction is sent with a photo, the bot uploads the image to a designated Google Drive folder and records the file link alongside the transaction data in the spreadsheet.

#### 2. Super Voucher System

A management module for tracking discount codes and their expiration dates.

* **Workflow**: Users add vouchers with specific expiration dates. The bot provides a check command to list vouchers expiring within 14 days and supports a daily automated trigger to notify the user of upcoming expirations.

#### 3. Debt Tracking

A dedicated module to record and monitor personal debts.

* **Workflow**: Debts are logged by name and amount. Users can filter the list by debtor name or delete entries once settled.

#### 4. Utility Tools

* **QR/Barcode Generation**: Converts text to various code formats.
* **License Plate Management**: Stores and retrieves vehicle owner information.
* **AI Translation and Voice**: Translates text or converts it to speech.

---

### Installation and Setup

1. **Bot Creation**: Create a new bot via @BotFather on Telegram and obtain the API Token.
2. **Database Preparation**: Create a Google Sheet and copy its ID from the URL.
3. **Script Deployment**:
* Open the Google Sheet, go to Extensions, and select Apps Script.
* Paste the provided source code into the editor.
* Run the `setupEnvironment` function once to initialize your Token, Sheet ID, and Web App URL.
* Deploy the script as a Web App (Access: Anyone).


4. **Webhook Activation**: Run the `setWebhook` function to connect your script to the Telegram API.

---

### Command Documentation

#### Financial Commands

* **General Fund**: `/c [amount] [description]` (Attach photo for bill logging).
* **Salary Fund**: `/lcb [amount] [description]` (Attach photo for bill logging).

#### Voucher Commands

* **Add**: `/voucher [value] [code] [dd/mm/yyyy] [brand]`.
* **Check**: `/checkvoucher` (Lists vouchers expiring in <14 days).
* **Use**: `/use [code]` (Marks voucher as used).

#### Debt Commands

* **Log**: `/n [amount] [name] [note]`.
* **View**: `/nlist` or `/nlist [name]`.
* **Delete**: `/ndelete [index]`.

#### Utility Commands

* **QR Code**: `/qr [content]`.
* **License Plate**: `/bsx [plate]` or `/bsx [plate] [owner_name]`.
* **Translate**: `/dich [text]`.

---

### Message Examples and Bot Responses

**User Input (Finance):**
`/c -50000 Lunch` (with image)

**Bot Response:**
`[GENERAL FUND]`
`EXPENSE: 50,000 VND`
`NOTE: Lunch`
`BALANCE: 1,450,000 VND`
`Bill attached successfully`

---

**User Input (Voucher Check):**
`/checkvoucher`

**Bot Response:**
`EXPIRING VOUCHERS`
`Brand Name (Value)`
`Code: CODE123`
`Expires: 15/03/2026 (3 days remaining)`

---

### Security and Data Handling

The bot uses `PropertiesService` to store sensitive credentials. All media files uploaded via chat are stored in a private Google Drive folder named "TelegramImage". It is recommended to keep the Spreadsheet and Drive folder private to the authorized user.

