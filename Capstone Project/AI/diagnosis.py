# First, ensure that you have FastAPI and Uvicorn installed:
# pip install fastapi uvicorn

from fastapi import FastAPI, HTTPException
import joblib
from fastapi.middleware.cors import CORSMiddleware
from underthesea import word_tokenize

# Load your trained model (ensure the path is correct for your local system)
# model = joblib.load("D:\\Study\\InSchool\\SP24\\AI\\random_forest.joblib")

# Tải mô hình
try:
    model = joblib.load("D:\\Study\\InSchool\\SP24\\AI\\random_forest.joblib")
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")


app = FastAPI(title="Diagnosis of disease API", description="API for Diagnosis of disease", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Define your weight array and arr_processed as before (ensure they are correctly defined)
weight = [6.0, 5.0, 8.0, 6.0, 9.0, 8.0, 8.0, 8.0, 6.0, 8.0, 9.0, 8.0, 8.0, 8.0, 9.0, 8.0, 8.0, 9.0, 9.0, 8.0, 9.0, 9.0, 8.0, 9.0, 9.0, 8.0, 9.0, 9.0, 9.0, 7.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 8.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 6.0, 9.0, 9.0, 9.0, 9.0, 8.0, 9.0, 9.0, 9.0, 9.0, 7.0, 9.0, 9.0, 8.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 8.0, 8.0, 9.0, 9.0, 8.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 7.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 8.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 8.0, 8.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 8.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 8.0, 8.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 0.0, 0.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 8.0, 8.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0]
arr_processed = ['sốt', 'đau đầu', 'ho', 'mệt mỏi', 'đau họng', 'sổ mũi', 'hắc hơi', 'nghẹt mũi', 'đau rát họng', 'nói nuốt khó', 'nhức đầu', 'ù tai', 'ho khạc', 'khô họng', 'nóng rát trong họng hoặc có cảm giác ngứa họng', 'vướng họng', 'ho nhiều vào ban đêm', 'khi lạnh tiếng nói bị khàn', 'khạc đờm dẻo và đặc', 'đờm dẻo và đặc thường tăng lên khi nuốt', 'nóng rát trong họng', 'đằng hắng để làm long đờm', 'tiếng nói bị khàn', 'nóng rát', 'khô mũi họng', 'chảy nước mũi', 'hắc hơi liên tục', 'toàn thân mệt mỏi', 'ăn ngủ kém', 'sốt cao', 'môi khô lưỡi bẩn', 'mạch nhanh', 'đau đầu nặng', 'đau đầu nặng, kèm đau rát họng', 'đau mỏi toàn thân', 'khô cổ họng', 'khô miệng', 'đau rát hoặc ngứa cổ họng', 'tức ngực', 'khó thở', 'khó nuốt, hay bị sặc khi ăn', 'thở khò khè', 'hay khạc nhổ', 'ngứa cổ họng', 'co giật', 'rối loạn cảm giác', 'chuột rút', 'đau thắt bụng', 'rối loạn cảm giác, ở tay, mặt hoặc chân', 'da, tóc, móng bị ảnh hưởng', 'nhịp tim rối loạn', 'cảm thấy mệt đột ngột không giải thích được', 'cảm giác chóng mặt', 'lo âu', 'run tay', 'cảm giác tay chân nặng nề, yếu', 'da tái xanh', 'vã mồ hôi, thường là ở tay, chân, nách', 'hồi hộp đánh trống ngực', 'mất bình tĩnh', 'vã mồ hôi', 'hồi hộp', 'hốt hoảng', 'có hiện tượng tăng tiết nước bọt', 'cảm giác ớn lạnh', 'chóng mặt', 'sự nhầm lẫn tạm thời', 'cái nhìn trống rỗng', 'cơ bắp cứng', 'mất ý thức', 'nhìn chằm chằm vào khoảng không', 'sợ hãi', 'lo lắng', 'chuyển động giật không thể kiểm soát của cánh tay và chân', 'cảm giác như có một dải băng quấn chặt quanh đầu', 'chỉ kéo dài trong thời gian ngắn', 'đau cả 2 bên đầu', 'mức độ đau: nhẹ đến vừa', 'đau đầu dữ dội', 'đau dồn dập', 'mức độ đau: vừa đến nặng', 'chỉ xuất hiện một bên đầu', 'nhạy cảm với ánh sáng, tiếng ồn', 'đau đầu buồn nôn', 'đau đầu kéo dài, diễn ra vài giờ, vài ngày, lặp đi lặp lại', 'đau căng đầu', 'đau dữ dội', 'buồn nôn', 'đau nhức nhối', 'thường bị một bên mắt', 'bắt đầu từ một bên đầu', 'có triệu chứng sưng mắt', 'chảy nước mắt', 'đỏ và nghẹt mũi', 'bắt đầu từ xung quanh và phía sau mắt', 'ảnh hưởng một bên đầu', 'đau vùng thượng vị', 'chán ăn', 'ăn uống kém', 'nôn', 'ợ hơi', 'ợ chua', 'trướng bụng', 'sôi bụng', 'trung tiện nhiều', 'đau bụng vùng chậu', 'biểu hiện rụng trứng: đau vú', 'biểu hiện rụng trứng: chảy máu âm đạo', 'biểu hiện rụng trứng: sưng đầu vú', 'đau bụng vùng bụng dưới', 'đau bụng không rõ nguyên nhân', 'không có phát hiện bất thường', 'cảm giác nóng rát ở ngực', 'ợ nóng', 'thường bị sau khi ăn', 'có thể nặng hơn vào ban đêm', 'đau ngực', 'khó nuốt', 'thức ăn trong dạ dày bị chua', 'cảm giác có khối u chặn ở cổ họng', 'rối loạn đại tiện', 'đau bụng', 'đầy hơi', 'khó tiêu', 'chướng bụng', 'nôn mửa', 'tiêu chảy', 'đi đại tiện ít hơn 3 lần / tuần', 'phân cứng và khó đẩy ra ngoài', 'đau khi đi đại tiện', 'máu trên bề mặt phân cứng', 'phân có đường kính lớn có thể gây tắc nghẽn nhà vệ sinh', 'cảm giác nóng rát', 'nôn ói', 'cảm thấy no sớm ngay đầu bữa ăn', 'cảm thấy khó chịu sau bữa ăn', 'nhiệt độ >= 37,5 độ c', 'cảm thấy lạnh', 'run', 'rùn mình', 'da sờ thấy nóng', 'đau cơ', 'mất nước: đi tiểu ít, mắt trũng sâu, không có nước mắt', 'suy yếu', 'trầm cảm', 'khó ngủ', 'buồn ngủ', 'đổ mồ hơi', 'mất nước', 'vết thương chảy dịch vàng, hoặc xanh lá cây', 'vết thương có mùi hôi', 'vị trí vết thương hay khu vực gần vết thương đau nhiều, sưng, đỏ tấy', 'vết thương thay đổi màu sắc hoặc kích thước', 'ớn lạnh', 'đau đớn', 'sưng tấy', 'bầm tím', 'khả năng cử động khớp hạn chế', 'nghe hoặc cảm thấy "bộp" trong khớp tại thời điểm bị thương', 'tổn thương lớp ngoài biểu bì', 'bong tróc da', 'xước da', 'không chảy máu', 'tổn thương lớp biểu bì và hạ bì', 'chảy máu nhẹ', 'bị ma sát', 'ảnh hưởng lớp mô dưới hạ bì', 'bị chảy máu nghiêm trọng', 'cần chăm sóc y tế', 'bị sau khi chấn thương', 'xương bị biến dạng tại vị trí tổn thương', 'xuất hiện vết bầm tím ở khu vực chấn thương', 'sưng và đau xung quanh vùng chấn thương', 'đau khi cố gắng vận động', 'mất chức năng vùng bị thương', 'đau khi bị tác động vào vị trí bị thương', 'xương đâm xuyên qua và nhô ra khỏi da', 'ngứa', 'có mảng da khô', 'da đỏ đến nâu sẫm', 'phát ban có thể bị rỉ nước hoặc chất lỏng trong suốt', 'chảy máu khi gãi', 'nổi mề đay', 'sưng mắt', 'da dày và cứng hơn', 'phát ban bất kì chỗ nào trên cơ thể', 'triệu chứng xuất hiện đồng thời nhiều điểm trên cơ thể', 'đỏ', 'sưng lên', 'cảm giác bỏng rát', 'tê', 'cảm giác ngứa ran', 'vết thương màu đỏ', 'ấn nhẹ vết thương có cảm giác đau', 'không có bọng nước hay phồng rộp', 'chỉ ảnh hưởng đến lớp ngoài của da (biểu bì', 'sưng', 'da đỏ, trắng hoặc có đốm', 'bóng nước phát triển và đau dữ dội', 'có thể để lại sẹo', 'vết bỏng chạm đến lớp mỡ dưới da', 'vùng bị cháy có màu đen, nâu hoặc trắng', 'da sần sùi, lở hoặc lồi cơ', 'có thể bị phá hủy dây thần kinh tê liệt', 'cay mắt', 'đỏ mắt', 'đau mắt', 'mắt nhiều mủ, nhưng một số ít trường hợp không có', 'ngứa mắt dữ dội', 'đỏ và chảy nước mắt', 'cộm mắt', 'nhìn mờ', 'nhạy cảm với ánh sáng', 'lông mi vón dính vào nhau', 'mắt mệt mỏi', 'nóng rát hoặc ngứa mắt', 'chảy nước mắt  hoặc khô mắt', 'đau cổ, vai hoặc lưng', 'tăng độ nhạy cảm với ánh sáng', 'khó tập trung', 'khó mở mắt', 'máu chảy từ trong mũi ra ngoài', 'thông thường, máu chỉ chảy từ một bên mũi', 'các mụn nước nhỏ nổi ở niêm mạc miệng có hình tròn hoặc hình bầu dục, đường kính từ 2-1mm', 'mục nước thường có màu trắng hoặc màu đục, rất dễ vỡ', 'khi vỡ tạo thành vết loét nông, bờ rõ rệt, cộm và lõm ở chính giữa', 'vết loét gây đau rát nhiều, nhất là khi ăn và nói chuyện', 'vết loét không có khả năng lây lan', 'có thể nổi đơn độc hoặc mọc rải rác', 'đau rát', 'có trường hợp vết loét số lượng nhiều và mọc tập trung thành đám', 'bị tấy đỏ vùng niêm mạc xung quanh, kèm theo cảm giác đau rát rất nhiều', 'nổi hạch ở góc hàm', 'sốt cao, gặp khó khăn khi ăn uống', 'sưng tấy nướu răng', 'đau nhức chân răng', 'lợi sưng đỏ, có mủ', 'chảy máu lợi, tụt lợi', 'hở cổ và chân răng', 'răng ngả màu', 'răng ố vàng', 'răng lung lay', 'đau nhức vùng má, xương hàm, đau thái dương', 'hôi miệng', 'căng cơ', 'cảm giác căng cứng và suy giảm chức năng vùng bị ảnh hưởng', 'cảm giác có thể chỉ một cơ', 'cảm giác lan rộng từ cơ này sang cơ khác', 'nôn ra máu', 'tiêu chảy kéo dài hơn 3 ngày', 'đau bụng dữ dội', 'nhiệt độ đo tại miệng cao hơn 38,6 độ c', 'mắt trũng', 'khát nước', 'đi cầu ra máu', 'đi tiểu ít hoặc không đi tiểu', 'cơ thể yếu trầm trọng', 'hoa mắt', 'tầm nhìn bị mờ', 'cơ yếu và ngứa ran cánh tay', 'tay hoặc chân lạnh', 'thở nhanh hoặc thở dốc']

@app.post("/diagnosis")
async def tokenize_text(input_text: str):
    # Tokenize the input text using underthesea
    tokens = word_tokenize(input_text)

    # Convert tokens to lowercase
    tokens = [token.lower() for token in tokens]

    result = [0] * len(arr_processed)

    # Update the result list based on the tokens
    for i, symptom in enumerate(arr_processed):
        if symptom in tokens:
            result[i] = weight[i]

    check = 0
    results = []
    for i in range(len(result)):
      if result[i] != 0:
          check = 1
          print(arr_processed[i])
          break

    print(check)

    if check == 1:
      # Chuyển đổi result thành mảng 2 chiều
      result_2d = [result]

      # Make predictions using the model (you may need to uncomment this part)
      predictions = model.predict(result_2d).tolist()
      return {"predictions": predictions}
    else:
      results.append("Bệnh chưa xác định!")
      return {"predictions": results}
# The following lines are only necessary if you're running the script directly:
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)