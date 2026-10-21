export interface Question {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
}

export const QUESTIONS_BANK: Question[] = [
  {
    id: 1,
    question: "Giữ chữ tín là việc làm nào dưới đây?",
    options: {
      A: "Hứa cho qua chuyện để người khác vui lòng.",
      B: "Chỉ làm những gì có lợi cho bản thân.",
      C: "Coi trọng lòng tin và giữ đúng lời hứa với người khác.",
      D: "Chỉ giữ lời hứa với người lớn tuổi."
    },
    correctAnswer: "C",
    explanation: "Giữ chữ tín là coi trọng lòng tin của mọi người, giữ lời hứa và tạo dựng sự tin tưởng."
  },
  {
    id: 2,
    question: "Biểu hiện nào dưới đây là KHÔNG giữ chữ tín?",
    options: {
      A: "Hứa suông, nói một đằng làm một nẻo.",
      B: "Đi học đúng giờ.",
      C: "Thực hiện đúng cam kết.",
      D: "Trả đồ mượn đúng hẹn."
    },
    correctAnswer: "A",
    explanation: "Hứa suông, nói một đằng làm một nẻo là biểu hiện của sự thất hứa, đánh mất chữ tín."
  },
  {
    id: 3,
    question: "Người biết giữ chữ tín sẽ nhận được điều gì từ mọi người?",
    options: {
      A: "Sự dè chừng và xa lánh.",
      B: "Sự ghen ghét, đố kỵ.",
      C: "Sự lợi dụng để làm việc riêng.",
      D: "Sự tin cậy, tín nhiệm và quý mến."
    },
    correctAnswer: "D",
    explanation: "Người giữ chữ tín luôn nhận được sự tin cậy, kính trọng và yêu quý từ mọi người."
  },
  {
    id: 4,
    question: "Câu tục ngữ nào nói về việc giữ chữ tín?",
    options: {
      A: "Ăn quả nhớ kẻ trồng cây.",
      B: "Học ăn, học gói, học mở.",
      C: "Một lần bất tín, vạn lần bất tin.",
      D: "Gần mực thì đen, gần đèn thì rạng."
    },
    correctAnswer: "C",
    explanation: "'Một lần bất tín, vạn lần bất tin' khuyên ta phải luôn giữ lời hứa để bảo vệ lòng tin."
  },
  {
    id: 5,
    question: "Biểu hiện nào thể hiện sự giữ chữ tín trong học tập?",
    options: {
      A: "Chép bài của bạn trong giờ kiểm tra.",
      B: "Nộp bài tập về nhà đúng thời hạn yêu cầu.",
      C: "Nghỉ học không xin phép.",
      D: "Đi học muộn và nói dối hỏng xe."
    },
    correctAnswer: "B",
    explanation: "Hoàn thành và nộp bài đúng hạn đã cam kết thể hiện tinh thần trách nhiệm và giữ chữ tín."
  },
  {
    id: 6,
    question: "Hành vi nào thể hiện sự MẤT chữ tín trong kinh doanh?",
    options: {
      A: "Bán hàng đúng giá niêm yết.",
      B: "Quảng cáo sản phẩm đúng với thực tế.",
      C: "Giao hàng đúng hẹn với khách.",
      D: "Bán hàng giả, hàng kém chất lượng nhưng nói là cao cấp."
    },
    correctAnswer: "D",
    explanation: "Bán hàng giả, lừa dối người tiêu dùng là hành vi đánh mất chữ tín trong kinh doanh."
  },
  {
    id: 7,
    question: "Câu: 'Quân tử nhất ngôn...' thường đi liền với vế nào?",
    options: {
      A: "... tứ mã nan truy.",
      B: "... đi một ngày đàng, học một sàng khôn.",
      C: "... có công mài sắt, có ngày nên kim.",
      D: "... năng nhặt chặt bị."
    },
    correctAnswer: "A",
    explanation: "'Quân tử nhất ngôn, tứ mã nan truy' nhắc nhở lời đã nói ra thì phải tuyệt đối giữ lời."
  },
  {
    id: 8,
    question: "Vì sao chúng ta cần phải giữ chữ tín?",
    options: {
      A: "Để tạo lòng tin, giúp các mối quan hệ tốt đẹp, bền vững.",
      B: "Để được người khác cho tiền bạc.",
      C: "Để tránh bị xử phạt.",
      D: "Để khoe khoang với bạn bè."
    },
    correctAnswer: "A",
    explanation: "Giữ chữ tín giúp xây dựng niềm tin và sự tôn trọng lẫn nhau trong cuộc sống."
  },
  {
    id: 9,
    question: "Khi lỡ hẹn hoặc không thể thực hiện lời hứa vì lý do khách quan, em nên làm gì?",
    options: {
      A: "Im lặng coi như không có chuyện gì.",
      B: "Tránh mặt để không bị hỏi.",
      C: "Đổ lỗi cho người khác.",
      D: "Chân thành xin lỗi, giải thích rõ lý do và tìm cách bù đắp."
    },
    correctAnswer: "D",
    explanation: "Thẳng thắn xin lỗi và chủ động khắc phục thể hiện thái độ có trách nhiệm với lời nói của mình."
  },
  {
    id: 10,
    question: "Ý kiến nào dưới đây là ĐÚNG về chữ tín?",
    options: {
      A: "Chữ tín chỉ cần trong kinh doanh, đời sống không cần.",
      B: "Chữ tín là thước đo phẩm chất đạo đức của con người.",
      C: "Giữ chữ tín là việc của riêng người lớn.",
      D: "Có thể hứa tùy tiện miễn là lúc đó thấy vui."
    },
    correctAnswer: "B",
    explanation: "Chữ tín là phẩm chất đạo đức quan trọng hàng đầu của mỗi cá nhân trong xã hội."
  },
  {
    id: 11,
    question: "Trong các bạn sau, bạn nào biết giữ chữ tín?",
    options: {
      A: "A hứa giúp mẹ quét sân nhưng mải chơi game nên quên.",
      B: "B hứa chỉ bài cho bạn nhưng đến hẹn lại tắt máy đi chơi.",
      C: "C mượn truyện hẹn thứ Hai trả và đúng thứ Hai trả cẩn thận.",
      D: "D nhận trực nhật thay bạn nhưng bỏ về sớm."
    },
    correctAnswer: "C",
    explanation: "Bạn C mượn đồ và hoàn trả đúng hẹn, cẩn thận là người biết giữ chữ tín."
  },
  {
    id: 12,
    question: "Hành động nào là biểu hiện của 'nói đi đôi với làm'?",
    options: {
      A: "Nhận nhiệm vụ nhóm và hoàn thành đúng tiến độ cam kết.",
      B: "Hứa học chăm nhưng kết quả môn nào cũng yếu.",
      C: "Thích hứa hẹn to tát nhưng không bao giờ làm.",
      D: "Nhận lời cho qua chuyện rồi quên luôn."
    },
    correctAnswer: "A",
    explanation: "Nói đi đôi với làm là cam kết gắn liền với hành động thực tế và trách nhiệm."
  },
  {
    id: 13,
    question: "Giữ chữ tín mang lại ý nghĩa gì cho bản thân?",
    options: {
      A: "Giúp luôn đạt điểm 10 trong học tập.",
      B: "Không bao giờ gặp khó khăn trong cuộc sống.",
      C: "Hoàn thiện bản thân, được mọi người quý mến và tin cậy.",
      D: "Có nhiều tiền bạc hơn người khác."
    },
    correctAnswer: "C",
    explanation: "Giữ chữ tín rèn luyện nhân cách và tạo dựng uy tín quý giá cho bản thân."
  },
  {
    id: 14,
    question: "Hậu quả lâu dài của việc thường xuyên thất hứa là gì?",
    options: {
      A: "Mất đi sự tin cậy, không ai muốn hợp tác hay tin tưởng nữa.",
      B: "Được nể trọng hơn vì thẳng thắn.",
      C: "Không ảnh hưởng gì đến các mối quan hệ.",
      D: "Được giao thêm nhiều trọng trách lớn."
    },
    correctAnswer: "A",
    explanation: "Thất hứa liên tục sẽ đánh mất niềm tin và bị mọi người xa lánh."
  },
  {
    id: 15,
    question: "Minh hứa đá bóng với em lúc 4h chiều nhưng có phim hay. Để giữ chữ tín, Minh nên:",
    options: {
      A: "Ở nhà xem phim, mặc kệ em đợi.",
      B: "Xem phim xong mới ra bảo là quên.",
      C: "Nhờ người khác đi đá bóng thay mình.",
      D: "Giữ lời đi đá bóng với em đúng giờ, xem phim sau."
    },
    correctAnswer: "D",
    explanation: "Giữ lời hứa với người thân, dù là em nhỏ, là biểu hiện đẹp của việc giữ chữ tín."
  },
  {
    id: 16,
    question: "Việc 'giữ chữ tín' có thể hiện trong việc nhỏ hằng ngày không?",
    options: {
      A: "Không, chỉ hợp đồng lớn mới gọi là giữ chữ tín.",
      B: "Có, thể hiện từ việc nhỏ như đúng giờ, mượn đồ trả đúng hẹn.",
      C: "Tùy thuộc vào việc người đó có thích hay không.",
      D: "Chỉ khi có người giám sát mới cần giữ."
    },
    correctAnswer: "B",
    explanation: "Chữ tín được tôi luyện từ những hành vi nhỏ nhất mỗi ngày."
  },
  {
    id: 17,
    question: "Nhận định nào sau đây là SAI về chữ tín?",
    options: {
      A: "Giữ chữ tín là tôn trọng đối phương và tôn trọng chính mình.",
      B: "Người giữ chữ tín là người biết quý trọng danh dự bản thân.",
      C: "Giữ chữ tín giúp bạn bè thêm gắn bó.",
      D: "Chỉ người kinh doanh mới cần giữ chữ tín, học sinh chưa cần."
    },
    correctAnswer: "D",
    explanation: "Học sinh cũng rất cần rèn luyện chữ tín trong học tập và sinh hoạt với bạn bè, thầy cô."
  },
  {
    id: 18,
    question: "Khi bạn giao bí mật và dặn giữ kín, việc em im lặng thể hiện điều gì?",
    options: {
      A: "Sự giữ chữ tín và tôn trọng bạn bè.",
      B: "Sự khép kín, không hòa đồng.",
      C: "Sự sợ hãi bạn bè.",
      D: "Sự vô cảm với mọi chuyện."
    },
    correctAnswer: "A",
    explanation: "Bảo vệ bí mật khi đã hứa là bảo vệ niềm tin bạn bè đã gửi gắm."
  },
  {
    id: 19,
    question: "Hoa thấy em nhỏ lạc đường khi đang về nhà đúng hẹn với mẹ. Hoa nên xử lý thế nào?",
    options: {
      A: "Bỏ mặc em nhỏ để chạy về nhà cho đúng giờ.",
      B: "Đứng chơi với em nhỏ đến chiều rồi về.",
      C: "Dẫn em nhỏ đến công an/y tế gửi nhờ và gọi điện báo cho mẹ.",
      D: "Bảo em nhỏ tự đi tìm bố mẹ."
    },
    correctAnswer: "C",
    explanation: "Vừa kịp thời giúp đỡ người gặp nạn, vừa thông báo để mẹ an tâm là cách xử lý chuẩn mực."
  },
  {
    id: 20,
    question: "Tối trước ngày nộp bài nhóm thì máy tính của Nam bị hỏng. Nam nên làm gì?",
    options: {
      A: "Kệ đi, sáng mai nói dối quên USB.",
      B: "Đi ngủ, sáng mai tính sau.",
      C: "Đổ lỗi cho máy tính kém chất lượng.",
      D: "Báo ngay cho nhóm và phối hợp cùng bạn làm bù kịp giờ."
    },
    correctAnswer: "D",
    explanation: "Chủ động thông báo sự cố và cùng tìm giải pháp khắc phục thể hiện trách nhiệm cao."
  },
  {
    id: 21,
    question: "Cửa hàng bán đúng giá, cân đong chính xác, hàng chuẩn thể hiện đức tính gì?",
    options: {
      A: "Tiết kiệm.",
      B: "Giữ chữ tín.",
      C: "Khiêm tốn.",
      D: "Giản dị."
    },
    correctAnswer: "B",
    explanation: "Kinh doanh trung thực, đúng cam kết là biểu hiện rõ nét của việc giữ chữ tín."
  },
  {
    id: 22,
    question: "Bạn Hùng hay mượn bút nhưng hay quên trả, hậu quả là gì?",
    options: {
      A: "Hùng tiết kiệm được tiền mua bút.",
      B: "Các bạn không còn tin tưởng để cho mượn nữa.",
      C: "Hùng được các bạn yêu quý hơn.",
      D: "Thầy cô sẽ khen ngợi Hùng."
    },
    correctAnswer: "B",
    explanation: "Hay quên trả đồ mượn làm hao mòn lòng tin của bạn bè xung quanh."
  },
  {
    id: 23,
    question: "Tình huống nào phản ánh sự THIẾU giữ chữ tín trong gia đình?",
    options: {
      A: "Bố bận đột xuất nên gọi điện báo hoãn đi sở thú sang tuần sau.",
      B: "Con hứa quét nhà trước khi đi học và đã làm xong.",
      C: "Mẹ hứa mua xe cho con khi đạt học sinh giỏi nhưng sau đó không mua vô cớ.",
      D: "Ông kể chuyện cổ tích cho cháu đúng như đã hứa."
    },
    correctAnswer: "C",
    explanation: "Hứa thưởng rồi thất hứa không lý do chính đáng làm giảm sút niềm tin trong gia đình."
  },
  {
    id: 24,
    question: "Tuấn từ chối cho bạn chép bài thi nhưng hẹn chiều sang giảng lại bài. Điều này thể hiện:",
    options: {
      A: "Tuấn ích kỷ, không giúp bạn.",
      B: "Tuấn sợ bị cô giáo phạt.",
      C: "Tuấn không thích bạn.",
      D: "Tuấn giữ đúng nguyên tắc trung thực và chân thành giúp bạn."
    },
    correctAnswer: "D",
    explanation: "Tuấn vừa giữ nguyên tắc trung thực trong thi cử, vừa tận tình hỗ trợ bạn học tập đúng cách."
  },
  {
    id: 25,
    question: "Mối quan hệ giữa 'giữ chữ tín' và 'lòng tự trọng' là gì?",
    options: {
      A: "Người có tự trọng luôn biết giữ chữ tín để bảo vệ danh dự bản thân.",
      B: "Hai phẩm chất này không liên quan đến nhau.",
      C: "Giữ chữ tín chỉ là hình thức bên ngoài.",
      D: "Chỉ khi có người khác nhìn thì mới cần giữ chữ tín."
    },
    correctAnswer: "A",
    explanation: "Lòng tự trọng thôi thúc con người giữ trọn chữ tín và danh dự của chính mình."
  },
  {
    id: 26,
    question: "Bạn nào CHƯA biết giữ chữ tín? (Mai: tiết lộ bí mật bạn dặn; Khoa: nộp bài đúng hạn; Tú: trốn trực nhật)",
    options: {
      A: "Bạn Mai và bạn Khoa.",
      B: "Bạn Khoa và bạn Tú.",
      C: "Cả 3 bạn.",
      D: "Bạn Mai và bạn Tú."
    },
    correctAnswer: "D",
    explanation: "Bạn Mai tiết lộ bí mật và bạn Tú trốn trực nhật là những hành vi chưa biết giữ chữ tín."
  },
  {
    id: 27,
    question: "Khi bạn bè rủ rê việc nguy hiểm hoặc trái quy định, thái độ đúng là:",
    options: {
      A: "Nhận lời ngay vì sợ bạn giận.",
      B: "Tỉnh táo phân biệt đúng sai, kiên quyết từ chối lời hứa sai trái.",
      C: "Đồng ý cho vui rồi tìm cách chuồn sau.",
      D: "Im lặng rồi làm theo."
    },
    correctAnswer: "B",
    explanation: "Giữ chữ tín không bao gồm việc cam kết làm điều xấu, vi phạm pháp luật hay nội quy."
  },
  {
    id: 28,
    question: "Thành ngữ, tục ngữ nào TRÁI NGƯỢC với việc giữ chữ tín?",
    options: {
      A: "Nói lời phải giữ lấy lời, đừng như con bướm đậu rồi lại bay.",
      B: "Hứa hươu hứa vượn / Nói suông / Đầu voi đuôi chuột.",
      C: "Một chữ cũng là thầy, nửa chữ cũng là thầy.",
      D: "Uống nước nhớ nguồn."
    },
    correctAnswer: "B",
    explanation: "'Hứa hươu hứa vượn', 'Nói suông' chỉ thói quen hứa hão mà không làm, trái ngược với chữ tín."
  }
];
