# Hướng dẫn Bảo trì và Phát triển Ứng dụng

Tài liệu này cung cấp các hướng dẫn cần thiết để bảo trì, cập nhật và mở rộng ứng dụng MathPractice.

## 1. Cấu trúc Dự án

Dưới đây là mô tả về các thư mục và tệp quan trọng trong dự án:

```
/
├── app/                  # Chứa các trang chính của ứng dụng (Next.js App Router)
│   ├── page.tsx          # Trang chủ (đăng nhập/chọn tên)
│   ├── select-exam/      # Trang chọn bộ đề luyện tập
│   ├── practice/         # Trang làm bài luyện tập
│   ├── results/          # Trang hiển thị kết quả
│   └── layout.tsx        # Layout chung của toàn bộ ứng dụng
├── components/           # Các component React tái sử dụng
│   └── ui/               # Các component từ shadcn/ui (Button, Card, etc.)
├── public/               # Chứa các tài sản tĩnh
│   └── data/             # Nơi lưu trữ các tệp JSON của bộ đề (ví dụ: de1.json)
├── styles/               # (Nếu có) Chứa các tệp CSS global
├── lib/                  # (Nếu có) Chứa các hàm tiện ích
└── README.md             # Tài liệu giới thiệu dự án
```

## 2. Quản lý Dữ liệu Đề thi

### Định dạng File JSON

Mỗi bộ đề luyện tập là một tệp `.json` được lưu trong thư mục `public/data/`. Tên tệp phải theo định dạng `de<ID>.json`, ví dụ: `de1.json`, `de2.json`.

Cấu trúc của một tệp JSON phải tuân thủ định dạng sau:

```json
{
  "examId": "de1", // ID định danh, khớp với tên file
  "title": "Đề 1", // Tên của bộ đề
  "description": "AI hints and explanations", // Mô tả ngắn gọn
  "questions": [
    {
      "id": 1, // ID của câu hỏi (số nguyên)
      "question": "Nội dung câu hỏi. Hỗ trợ MathJax, ví dụ: \\( x^2 + y^2 = z^2 \\)",
      "image": null, // Đường dẫn đến hình ảnh nếu có, ví dụ: "/images/de1/cau1.png"
      "options": [
        "A. Lựa chọn 1",
        "B. Lựa chọn 2",
        "C. Lựa chọn 3"
      ],
      "correctAnswer": "A", // Đáp án đúng
      "explanation": "Giải thích chi tiết cho câu trả lời. Hỗ trợ HTML và MathJax.",
      "difficulty": "medium", // Độ khó (easy, medium, hard)
      "topic": "Linear Algebra", // Chủ đề của câu hỏi
      "hints": [
        "Gợi ý 1",
        "Gợi ý 2"
      ]
    }
    // ... các câu hỏi khác
  ]
}
```

**Lưu ý quan trọng:**

- **MathJax**: Để hiển thị công thức toán, sử dụng `\\(` và `\\)` cho inline math, và `\\[` và `\\]` cho display math.
- **HTML**: Bạn có thể sử dụng các thẻ HTML cơ bản (như `<b>`, `<i>`, `<br>`, `<ul>`, `<li>`) trong trường `explanation` để định dạng nội dung.

### Thêm một Bộ đề mới

1.  **Chuẩn bị file JSON**: Tạo một tệp `.json` mới với cấu trúc như đã mô tả ở trên.
2.  **Đặt tên file**: Đặt tên tệp theo quy tắc `de<ID>.json`. Ví dụ, để thêm đề số 11, bạn tạo tệp `de11.json`.
3.  **Thêm vào thư mục `public/data/`**: Sao chép tệp vừa tạo vào thư mục `public/data/`.
4.  **Cập nhật hằng số (nếu cần)**: Trong file `app/select-exam/page.tsx`, có một hằng số `MAX_EXAMS_TO_CHECK`. Nếu bạn thêm một đề có ID lớn hơn giá trị hiện tại của hằng số này, hãy tăng giá trị đó lên để ứng dụng có thể phát hiện ra đề mới.

    ```typescript
    // app/select-exam/page.tsx
    const MAX_EXAMS_TO_CHECK = 10; // Tăng giá trị này nếu ID đề mới > 10
    ```

Ứng dụng sẽ tự động phát hiện và hiển thị bộ đề mới trên trang chọn đề.

## 3. Tùy chỉnh Giao diện (Styling)

- **Tailwind CSS**: Dự án sử dụng Tailwind CSS để styling. Bạn có thể chỉnh sửa các class utility trực tiếp trong các file component.
- **Dark Mode**: Chế độ tối/sáng được quản lý bởi `ThemeProvider` trong `app/layout.tsx` và `ThemeToggle` component. Để tùy chỉnh màu sắc cho dark mode, sử dụng tiền tố `dark:`, ví dụ: `bg-white dark:bg-black`.
- **Global Styles**: Các style toàn cục có thể được định nghĩa trong `app/globals.css`.

## 4. Quản lý Dependencies

- Dự án sử dụng `npm` để quản lý các gói thư viện.
- Để thêm một thư viện mới, chạy: `npm install <ten-thu-vien>`.
- Để xóa một thư viện, chạy: `npm uninstall <ten-thu-vien>`.
- Sau khi thay đổi dependencies, hãy đảm bảo bạn commit cả file `package.json` và `package-lock.json`.

Cảm ơn bạn đã đóng góp vào việc bảo trì và phát triển dự án! 