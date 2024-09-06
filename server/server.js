const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// 모바일 GPS 위치 데이터를 저장할 변수
let mobileLocation = { lat: null, lng: null };

// 출입금지 구역 좌표 설정 (예시 좌표)
const restrictedArea = [
    { lat: 35.9470822, lng: 126.6853641 }, // 좌표 1
    { lat: 35.9467586, lng: 126.6854137 }, // 좌표 2
    { lat: 35.9467934, lng: 126.6856927 }, // 좌표 3
    { lat: 35.9471093, lng: 126.6856364 }, // 좌표 4
    { lat: 35.9470822, lng: 126.6853641 }  // 좌표 5 (첫 번째 좌표로 다시 닫음)
];

// 출입금지 구역 감지 함수
function isInsideRestrictedArea(lat, lng) {
    // 출입금지 구역 여부를 확인하는 로직 (단순 비교 예시)
    return restrictedArea.some(area => lat === area.lat && lng === area.lng);
}

// CORS 설정: 웹사이트의 도메인만 허용
const corsOptions = {
    origin: 'https://YOUR_NETLIFY_WEBSITE.netlify.app',  // 웹사이트 URL을 넣으세요
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));  // CORS 설정 적용
app.use(express.json());  // JSON 데이터 파싱

// GPS 데이터를 서버로 전송하는 경로 (POST 요청)
app.post('/update-location', (req, res) => {
    const { lat, lng } = req.body;
    mobileLocation = { lat, lng };
    console.log('모바일 위치 업데이트:', mobileLocation);
    res.status(200).send('Location updated');
});

// 컴퓨터에서 GPS 데이터를 가져오는 경로 (GET 요청)
app.get('/get-location', (req, res) => {
    if (mobileLocation.lat && mobileLocation.lng) {
        const insideRestrictedArea = isInsideRestrictedArea(mobileLocation.lat, mobileLocation.lng);
        res.json({ location: mobileLocation, restricted: insideRestrictedArea });
    } else {
        res.status(404).send('위치 정보가 없습니다.');
    }
});

// 서버 실행
app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});
