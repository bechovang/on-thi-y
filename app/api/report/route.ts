// File: /app/api/report/route.ts (phiên bản gửi dữ liệu FAKE để test)

import { NextResponse } from 'next/server';

export async function POST(request: Request) { // `request` vẫn cần có ở đây, nhưng chúng ta sẽ không dùng nó
  try {
    console.log("--- API ROUTE GỬI DỮ LIỆU FAKE ĐÃ KÍCH HOẠT ---");

    // BƯỚC 1: Bỏ qua hoàn toàn dữ liệu từ client.
    // Dòng này đã được comment lại, chúng ta không đọc request.json() nữa.
    // const clientData = await request.json(); 

    // BƯỚC 2: TỰ TẠO RA DỮ LIỆU FAKE, SẠCH 100%
    const fakeData = {
      examId: "TEST_DE_01",
      questionId: "999",
      reportType: "Đề sai", // Sử dụng một giá trị mà ta biết chắc chắn có trong Form
      reportDescription: "Đây là mô tả test được gửi tự động từ server.",
      questionDataJson: '{ "id": 999, "message": "Đây là JSON test ngắn gọn." }'
    };
    console.log("Đã tạo dữ liệu FAKE để gửi đi:", fakeData);

    // Thông tin Google Form của bạn (giữ nguyên)
    const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfkiXPvUPvhFBjs79JfvnUU70LscxD-TFiltscELn2iaV8ZVw/formResponse";
    const ENTRY_ID_EXAM = "entry.1808402288";
    const ENTRY_ID_QUESTION = "entry.169134551";
    const ENTRY_ID_TYPE = "entry.1741549429";
    const ENTRY_ID_DESCRIPTION = "entry.1843236040";
    const ENTRY_ID_JSON_DATA = "entry.370356507";

    // BƯỚC 3: Tạo request body bằng dữ liệu FAKE
    const params = new URLSearchParams();
    params.append(ENTRY_ID_EXAM, fakeData.examId);
    params.append(ENTRY_ID_QUESTION, fakeData.questionId);
    params.append(ENTRY_ID_TYPE, fakeData.reportType);
    params.append(ENTRY_ID_DESCRIPTION, fakeData.reportDescription);
    params.append(ENTRY_ID_JSON_DATA, fakeData.questionDataJson);
    
    console.log("Đang gửi dữ liệu FAKE đến Google Form:", params.toString());

    // BƯỚC 4: Gửi yêu cầu đi (giữ nguyên)
    const response = await fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
        // Nếu vẫn lỗi ở đây, vấn đề 100% là ở Google Form
        throw new Error(`Google Form response was not ok: ${response.statusText}`);
    }

    console.log("GỬI DỮ LIỆU FAKE THÀNH CÔNG!");
    return NextResponse.json({ message: "Dữ liệu FAKE đã được gửi thành công!" }, { status: 200 });

  } catch (error) {
    console.error("Lỗi tại API Route khi gửi FAKE DATA:", error);
    return NextResponse.json({ message: "Đã có lỗi xảy ra phía server." }, { status: 500 });
  }
}