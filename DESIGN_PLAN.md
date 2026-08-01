# SCSGO Web App Redesign

## Design read

SCSGO Web là một ứng dụng điều phối sạc xe điện dành cho người dùng Việt Nam. Ngôn ngữ thiết kế theo hướng premium mobility: sáng, sạch, đáng tin cậy và ưu tiên bản đồ.

- Design variance: 6/10
- Motion intensity: 4/10
- Visual density: 6/10
- Màu chính: cobalt blue `#155EEF`
- Màu xanh lá chỉ dùng cho trạng thái còn trống hoặc đã xác nhận
- Card radius: 14px, input và button radius: 11px
- Font: Avenir Next, Avenir, Segoe UI và system sans-serif fallback

## Information architecture

| Route | Chức năng |
| --- | --- |
| `/` | Đi thẳng vào web app |
| `/login` | Đăng nhập, đăng ký, Google OAuth và quên mật khẩu |
| `/about` | Landing page giới thiệu cũ |
| `/app/home` | Tổng quan trạm gần đây, lịch sạc và bản đồ |
| `/app/map` | Bản đồ tương tác, tìm kiếm và bộ lọc |
| `/app/stations/:stationId` | Chi tiết trạm và đặt khung giờ |
| `/app/bookings` | Quản lý lịch đặt chỗ và lịch sử |
| `/app/feed` | Community feed và tạo bài viết |
| `/app/saved` | Trạm sạc đã lưu |
| `/app/profile` | Hồ sơ, xe, thanh toán và cài đặt tài khoản |

## Reference mockups

- `public/design-reference/dashboard.png`
- `public/design-reference/station-booking.png`
- `public/design-reference/account-bookings.png`

Các mockup dùng để khóa direction, hierarchy và nhịp bố cục. Code thật sử dụng semantic HTML, dữ liệu Supabase, MapLibre và responsive CSS thay vì nhúng ảnh mockup.

## Data strategy

- Supabase là nguồn dữ liệu chính cho tài khoản, hồ sơ, địa điểm, yêu thích, booking và community feed.
- Bộ trạm mẫu trong `src/data/stations.ts` là fallback khi Supabase chưa có dữ liệu.
- Booking được ghi vào Supabase khi tìm thấy station/slot hợp lệ. Một bản cục bộ được giữ để UI phản hồi ngay và hỗ trợ môi trường demo.
- MapLibre GL JS hiển thị bản đồ OpenStreetMap mà không yêu cầu API key phía client.

## Delivery phases

1. App shell, responsive navigation và semantic design tokens.
2. Home dashboard, bản đồ, tìm kiếm và lọc trạm.
3. Chi tiết trạm, chọn connector, ngày, giờ và xác nhận booking.
4. Bookings, saved stations, community và profile management.
5. Supabase migration, production build, lint, accessibility và browser QA.

