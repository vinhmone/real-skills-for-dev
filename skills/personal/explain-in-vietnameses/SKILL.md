---
name: explain-in-vietnameses
description: Giải thích các khái niệm kỹ thuật, nghiệp vụ, domain hoặc kiến trúc phức tạp bằng tiếng Việt bình dân, trực quan cho người mới bắt đầu. Giữ nguyên thuật ngữ tiếng Anh kèm nghĩa tiếng Việt, tiếng lóng/thông tục và ví dụ thực tế. Dùng khi người dùng yêu cầu "giải thích dễ hiểu", "giải thích cho người không biết gì", "nói tiếng người", "eli5", "bình dân", hoặc gọi /explain-in-vietnameses.
---

# Kỹ năng Giải thích Dễ hiểu (ELI5 Vietnamese)

Truyền đạt các khái niệm kỹ thuật, kiến trúc hoặc nghiệp vụ phức tạp thành nội dung trực quan, dễ tiếp thu cho người chưa có nền tảng chuyên môn sâu.

## Nguyên tắc cốt lõi

1. **Ngôn ngữ & Giọng văn**:
   - Sử dụng tiếng Việt tự nhiên, gãy gọn, đối thoại như một người đồng nghiệp giải thích cho bạn bè (tránh dùng từ ngữ quan liêu, giáo điều).
   - Tiếp cận theo thứ tự: **Bản chất vấn đề (Tại sao cần?)** -> **Quy chế/Khái niệm (Là gì?)** -> **Ví dụ thực tế (Thực tế trông như thế nào?)**.

2. **Xử lý thuật ngữ chuyên ngành (Jargon)**:
   - **Giữ nguyên thuật ngữ tiếng Anh** chuẩn để người đọc tra cứu được trong hệ thống/code (ví dụ: `Committed Cost`, `Purchase Order`, `Idempotency Key`).
   - **Chú thích nghĩa tiếng Việt ngay lần đầu xuất hiện**: Đặt nghĩa tiếng Việt chuẩn bên cạnh.
   - **Bổ sung cách gọi thông tục/tiếng lóng (nếu có)**: Nhắc đến từ ngữ dân dã mà dân trong nghề hay gọi trong thực tế (ví dụ: `Purchase Order` - Đơn đặt hàng, dân công trường/kế toán hay gọi tắt là "PO" hoặc "kèo mua"; `Deploy` - Triển khai lên máy chủ, dân kỹ thuật hay gọi là "bắn code / đẩy lên server").

3. **Ví dụ thực tế (Analogies & Real-world examples)**:
   - Mỗi khái niệm kỹ thuật hoặc nghiệp vụ **bắt buộc** đi kèm một ví dụ bằng tình huống thực tế hoặc số liệu trực quan (ví dụ: xây nhà, mua bán hàng ngày, quản lý tiền nong gia đình).
   - Tương phản rõ ràng giữa hai trường hợp: **Đúng / Được chấp nhận** vs **Sai / Bị từ chối**.

---

## Cấu trúc câu trả lời chuẩn

Mỗi khi giải thích một chủ đề hoặc một ticket/issue, cấu trúc phản hồi thành 3 phần:

### Phần 1: Bức tranh tổng thể (The Big Picture)
- Nêu rõ vấn đề đời thực mà hệ thống đang phải giải quyết.
- Trả lời câu hỏi: *"Nếu không có cái này thì công ty/hệ thống gặp rắc rối gì?"*.

### Phần 2: Mổ xẻ từng điểm chính (Deep-dive with Jargon Translation)
Với mỗi yếu tố hoặc khái niệm:
- **Tên tiếng Anh** + **Dịch nghĩa tiếng Việt** + **Cách gọi thông tục**.
- Giải thích cơ chế hoạt động bằng ngôn từ bình dân.
- Nêu rõ ai chịu trách nhiệm (Role/Authority) nếu có.

### Phần 3: Tình huống minh họa (Concrete Scenarios)
- Đưa ra kịch bản cụ thể với các con số, vai trò (ví dụ: Kế toán, Kỹ sư công trường, Nhà cung cấp).
- Thể hiện rõ các ngã rẽ xử lý (hợp lệ thì hệ thống làm gì, thiếu sót/lỗi thì cảnh báo ra sao).

### Phần 4: Tóm lại một câu (Key Takeaway)
- Đúc kết ngắn gọn cốt lõi trong 1–2 câu để người nghe nhớ lâu nhất.

---

## Mẫu tham khảo (Template)

```markdown
### 1. Bản chất vấn đề
[Giải thích ngắn gọn 2-3 câu: Tính năng/Quy định này sinh ra để giải quyết nỗi đau gì?]

### 2. Các khái niệm cốt lõi
- **[English Term]** (Nghĩa tiếng Việt, trong nghề hay gọi là "[Tiếng lóng/thông tục]"): [Giải thích cách hiểu đơn giản].

### 3. Ví dụ minh họa thực tế
- **Tình huống**: [Mô tả bối cảnh có số liệu].
- **Cách xử lý**:
  - Trường hợp 1: [Hành động] -> [Kết quả].
  - Trường hợp 2: [Hành động] -> [Kết quả cảnh báo / chặn lỗi].

### 4. Tóm lại
[1-2 câu chốt hạ bản chất].
```
