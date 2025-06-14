

# 📘 **HƯỚNG DẪN ĐỊNH DẠNG TOÁN TRONG JSON VÀ CẤU TRÚC ĐỀ THI**

---

## 1. 🎯 **Mục Tiêu**

Tài liệu này hướng dẫn cách xây dựng một đề thi Toán học sử dụng định dạng **JSON** kết hợp công thức **LaTeX**, hỗ trợ hiển thị tốt trên web nhờ thư viện MathJax hoặc KaTeX. Cách trình bày này phù hợp với các ứng dụng luyện tập trực tuyến, hệ thống kiểm tra tự động hoặc ứng dụng học tập tùy chỉnh.

---

## 2. 📦 **Cấu Trúc JSON cho Đề Thi Toán**

```json
{
  "examId": "de1",
  "title": "Basic Math Practice",
  "description": "Practice on derivatives, integrals, and functions",
  "questions": [
    {
      "id": 1,
      "question": "Find the derivative of \\( f(x) = x^2 \\sin(x) \\)<br />Choose the correct answer.",
      "image": "1.jpg",
      "options": [
        "A. \\( 2x \\sin(x) \\)",
        "B. \\( x^2 \\cos(x) \\)",
        "C. \\( 2x \\sin(x) + x^2 \\cos(x) \\)",
        "D. \\( 2x \\cos(x) + x^2 \\sin(x) \\)"
      ],
      "correctAnswer": "C",
      "explanation": "<b>Sử dụng quy tắc đạo hàm tích:</b><br />\\( f'(x) = 2x \\sin(x) + x^2 \\cos(x) \\)",
      "difficulty": "medium",
      "topic": "Derivatives",
      "hints": [
        "Xét đây là đạo hàm của tích hai hàm số.",
        "Áp dụng công thức: \\( (uv)' = u'v + uv' \\)"
      ]
    }
  ]
}
```

---

### ✅ Ý nghĩa các trường:

| Trường          | Ý nghĩa                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------- |
| `examId`        | Mã định danh đề thi.                                                                              |
| `title`         | Tiêu đề đề thi (tiếng Anh).                                                                       |
| `description`   | Mô tả đề thi (tiếng Anh).                                                                         |
| `questions`     | Danh sách câu hỏi.                                                                                |
| `id`            | Số thứ tự câu hỏi.                                                                                |
| `question`      | Câu hỏi (tiếng Anh, có thể chứa LaTeX, xuống dòng bằng `<br />`).                                 |
| `image`         | Tên tệp hình ảnh nếu có minh họa.                                                                 |
| `options`       | Các lựa chọn (tiếng Anh, có thể chứa LaTeX).                                                      |
| `correctAnswer` | Đáp án đúng (ký tự: `"A"`, `"B"`...).                                                             |
| `explanation`   | Giải thích bằng tiếng Việt, hỗ trợ LaTeX, **dùng `<br />` để xuống dòng** và **`<b>` để in đậm**. |
| `difficulty`    | Mức độ câu hỏi: `"easy"`, `"medium"`, `"hard"`.                                                   |
| `topic`         | Chủ đề: `"Derivatives"`, `"Integrals"`, v.v.                                                      |
| `hints`         | Gợi ý (tiếng Việt, là array, mỗi dòng là một phần tử, **không cần xuống dòng thêm**).             |

---

## 3. 🧮 **Viết Công Thức Toán bằng LaTeX**

### 3.1. ✅ **Toán inline** (`\\( ... \\)`)

Dùng để chèn công thức giữa dòng.

**Ví dụ:**

```json
"question": "Tính \\( \\int x^2 dx \\)"
```

---

### 3.2. ✅ **Toán block** (`\\[ ... \\]`)

Dành cho công thức dài, hiển thị riêng dòng.

**Ví dụ:**

```json
"explanation": "<b>Áp dụng công thức:</b><br />\\[ \\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C \\]"
```

---

### 3.3. 🔢 **Một số cú pháp LaTeX hữu ích**

| Biểu thức   | Cú pháp LaTeX        |
| ----------- | -------------------- |
| Phân số     | `\\frac{a}{b}`       |
| Căn bậc hai | `\\sqrt{x}`          |
| Đạo hàm     | `\\frac{d}{dx}`      |
| Tích phân   | `\\int`, `\\int_a^b` |
| Giới hạn    | `\\lim_{x \\to 0}`   |
| Lũy thừa    | `e^{x}`, `x^2`       |
| Nhân        | `\\cdot`, `*`        |

---

## 4. ↩️ **Quy Tắc Xuống Dòng và In Đậm**

| Trường        | Cách xuống dòng                                            | In đậm             |
| ------------- | ---------------------------------------------------------- | ------------------ |
| `question`    | Dùng `<br />`                                              | Dùng `<b>`         |
| `explanation` | Dùng `<br />`                                              | Dùng `<b>`         |
| `hints`       | Không cần xuống dòng<br>(mỗi phần tử array hiển thị riêng) | Dùng `<b>` nếu cần |

---

### 📌 Ví dụ `explanation` hoàn chỉnh:

```json
"explanation": "<b>Bước 1:</b> Đặt \\( u = x^2 \\), \\( dv = e^x dx \\)<br /><b>Bước 2:</b> Tính \\( du = 2x dx \\), \\( v = e^x \\)"
```

Hiển thị:

> **Bước 1:** Đặt \$u = x^2\$, \$dv = e^x dx\$
> **Bước 2:** Tính \$du = 2x dx\$, \$v = e^x\$

---

## 5. 🌐 **Tích Hợp MathJax hoặc KaTeX trên Web**

### MathJax (phổ biến)

```html
<script async src="https://cdn.jsdelivr.net/npm/mathjax@2.7.7/MathJax.js?config=TeX-MML-AM_CHTML"></script>
```

### KaTeX (nhẹ, nhanh)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.0/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.15.0/dist/katex.min.js"></script>
```

---

## 6. 🌏 **Quy Ước Ngôn Ngữ**

| Trường                                                               | Ngôn ngữ        |
| -------------------------------------------------------------------- | --------------- |
| `question`, `options`, `title`, `topic`, `description`, `difficulty` | 🇬🇧 Tiếng Anh  |
| `explanation`, `hints`                                               | 🇻🇳 Tiếng Việt |

> 🎯 Mục tiêu: luyện kỹ năng tiếng Anh, hiểu sâu bằng tiếng Việt.

---

## ✅ **Tổng Kết**

| Nội dung                       | Quy ước                                             |
| ------------------------------ | --------------------------------------------------- |
| Toán inline                    | `\\( ... \\)`                                       |
| Toán block                     | `\\[ ... \\]`                                       |
| Xuống dòng trong `question`    | `<br />`                                            |
| Xuống dòng trong `explanation` | `<br />`                                            |
| Không dùng `\\\\` trong JSON   | Vì đã chuyển sang dùng `<br />`                     |
| In đậm                         | Dùng HTML `<b>...</b>` thay vì `**...**` (Markdown) |
| Kết xuất toán học              | Tích hợp MathJax hoặc KaTeX                         |
| Ngôn ngữ                       | Câu hỏi bằng tiếng Anh – Giải thích bằng tiếng Việt |

---

**Lưu ý cuối cùng**: Sau khi xóa đoạn `currentQuestionData.explanation.replace(/\\\\/g, '<br />')`, bạn chỉ cần đảm bảo rằng:

* Mọi xuống dòng trong `"explanation"` đã được viết bằng `<br />`.
* Frontend sẽ hiển thị nguyên văn HTML (có nội dung `<br />`, `<b>...</b>`, LaTeX trong `\\[ ... \\]` hoặc `\\( ... \\)`).
* MathJax/KaTeX nhận diện và render công thức LaTeX tự động.

