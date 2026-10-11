import React, { useState } from 'react';
import { 
  Building2, RefreshCw, Filter, X, TrendingUp, DollarSign, ChevronRight, Building
} from 'lucide-react';

// 수도권(서울 전역 25개 구, 경기 전역 31개 시/군, 인천 전역 10개 구/군) 전수 목록
const REGION_OPTIONS = [
  // ================= 서울특별시 (25개 자치구) =================
  { code: '11680', label: '서울 강남구' },
  { code: '11740', label: '서울 강동구' },
  { code: '11305', label: '서울 강북구' },
  { code: '11500', label: '서울 강서구' },
  { code: '11620', label: '서울 관악구' },
  { code: '11215', label: '서울 광진구' },
  { code: '11530', label: '서울 구로구' },
  { code: '11545', label: '서울 금천구' },
  { code: '11350', label: '서울 노원구' },
  { code: '11320', label: '서울 도봉구' },
  { code: '11230', label: '서울 동대문구' },
  { code: '11590', label: '서울 동작구' },
  { code: '11440', label: '서울 마포구' },
  { code: '11410', label: '서울 서대문구' },
  { code: '11650', label: '서울 서초구' },
  { code: '11200', label: '서울 성동구' },
  { code: '11290', label: '서울 성북구' },
  { code: '11710', label: '서울 송파구' },
  { code: '11470', label: '서울 양천구' },
  { code: '11560', label: '서울 영등포구' },
  { code: '11170', label: '서울 용산구' },
  { code: '11380', label: '서울 은평구' },
  { code: '11110', label: '서울 종로구' },
  { code: '11140', label: '서울 중구' },
  { code: '11260', label: '서울 중랑구' },

  // ================= 경기도 (31개 시/군 구 단위) =================
  { code: '41111', label: '경기 수원시 장안구' },
  { code: '41113', label: '경기 수원시 권선구' },
  { code: '41115', label: '경기 수원시 팔달구' },
  { code: '41117', label: '경기 수원시 영통구' },
  { code: '41131', label: '경기 성남시 수정구' },
  { code: '41133', label: '경기 성남시 중원구' },
  { code: '41135', label: '경기 성남시 분당구' },
  { code: '41150', label: '경기 의정부시' },
  { code: '41171', label: '경기 안양시 동안구' },
  { code: '41173', label: '경기 안양시 만안구' },
  { code: '41190', label: '경기 부천시' },
  { code: '41210', label: '경기 광명시' },
  { code: '41220', label: '경기 평택시' },
  { code: '41250', label: '경기 동두천시' },
  { code: '41271', label: '경기 안산시 상록구' },
  { code: '41273', label: '경기 안산시 단원구' },
  { code: '41281', label: '경기 고양시 덕양구' },
  { code: '41285', label: '경기 고양시 일산동구' },
  { code: '41287', label: '경기 고양시 일산서구' },
  { code: '41290', label: '경기 과천시' },
  { code: '41310', label: '경기 구리시' },
  { code: '41360', label: '경기 남양주시' },
  { code: '41370', label: '경기 오산시' },
  { code: '41390', label: '경기 시흥시' },
  { code: '41410', label: '경기 군포시' },
  { code: '41430', label: '경기 의왕시' },
  { code: '41450', label: '경기 하남시' },
  { code: '41461', label: '경기 용인시 처인구' },
  { code: '41463', label: '경기 용인시 기흥구' },
  { code: '41465', label: '경기 용인시 수지구' },
  { code: '41480', label: '경기 파주시' },
  { code: '41500', label: '경기 이천시' },
  { code: '41550', label: '경기 안성시' },
  { code: '41570', label: '경기 김포시' },
  { code: '41590', label: '경기 화성시' },
  { code: '41610', label: '경기 광주시' },
  { code: '41630', label: '경기 양주시' },
  { code: '41650', label: '경기 포천시' },
  { code: '41670', label: '경기 여주시' },
  { code: '41800', label: '경기 연천군' },
  { code: '41820', label: '경기 가평군' },
  { code: '41830', label: '경기 양평군' },

  // ================= 인천광역시 (10개 구/군) =================
  { code: '28110', label: '인천 중구' },
  { code: '28140', label: '인천 동구' },
  { code: '28177', label: '인천 미추홀구' },
  { code: '28185', label: '인천 연수구 (송도)' },
  { code: '28200', label: '인천 남동구' },
  { code: '28237', label: '인천 부평구' },
  { code: '28245', label: '인천 계양구' },
  { code: '28260', label: '인천 서구 (청라/검단)' },
  { code: '28710', label: '인천 강화군' },
  { code: '28720', label: '인천 옹진군' },
];

function App() {
  const [selectedRegion, setSelectedRegion] = useState('41117'); // 기본값: 수원시 영통구
  const [propertyType, setPropertyType] = useState('apt'); // 'apt' | 'villa'
  const [dealYmd, setDealYmd] = useState('202405'); // 데이터가 많은 시점 기본값 적용
  const [maxRatio, setMaxRatio] = useState(80);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('조건 설정 후 [실거래가 찍힌 경매 매물 탐색] 버튼을 누르세요.');
  const [realTrades, setRealTrades] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // 데이터 연동 및 경매-실거래 매칭 함수
  const handleFetchData = async () => {
    setLoading(true);
    setStatusMessage('CODEF 대법원 경매 및 국토부 실거래가 통합 조회 중...');

    const tradeEndpoint = propertyType === 'apt' ? '/api/apt-trades' : '/api/villa-trades';
    const backendUrl = 'https://propvalue-backend.onrender.com';

    try {
      const [tradeRes, auctionRes] = await Promise.all([
        fetch(`${backendUrl}${tradeEndpoint}?lawdCd=${selectedRegion}&dealYmd=${dealYmd}`),
        fetch(`${backendUrl}/api/codef-auction-mock?regionCode=${selectedRegion}&buildingType=${propertyType}`)
      ]);

      const tradeResult = await tradeRes.json();
      const auctionResult = await auctionRes.json();

      if (tradeResult.success && tradeResult.data) {
        // 단일 객체({...})로 들어올 경우를 대비해 배열 형태 검증 방어 로직 추가
        const rawTradeData = Array.isArray(tradeResult.data) 
          ? tradeResult.data 
          : [tradeResult.data];

        const mockAuctionList = auctionResult.data || [];

        const formattedData = rawTradeData.map((item, idx) => {
          const rawPrice = parseInt((item.dealAmount || item.mdfyDeAmt || '0').replace(/,/g, '').trim(), 10) * 10000;
          
          const matchedAuction = mockAuctionList[idx % Math.max(1, mockAuctionList.length)];
          const caseNo = matchedAuction ? matchedAuction.resCaseNo : `2024타경${2000 + idx}`;

          const mockRatio = 0.65 + (idx % 20) * 0.01;
          const auctionPrice = matchedAuction?.resMinLowerPrice 
            ? matchedAuction.resMinLowerPrice 
            : Math.round(rawPrice * mockRatio);

          const ratioPercent = Math.round((auctionPrice / rawPrice) * 100);
          const profit = rawPrice - auctionPrice;

          const kbPrice = Math.round(rawPrice * 1.02);
          const officialPrice = Math.round(rawPrice * 0.68);

          const itemName = item.aptNm || item.mrhousNm || item.단지명 || (propertyType === 'apt' ? '아파트' : '빌라/다세대');

          return {
            id: `trade-${idx}`,
            caseNo: caseNo,
            name: `${itemName} ${item.floor || item.flr || 3}층`,
            type: propertyType === 'apt' ? '아파트' : '빌라/다세대',
            address: `${item.umdNm || item.legalDong || ''} ${item.jibun || ''}`,
            area: parseFloat(item.excluUseAr || item.mdfyExcluUseAr || 84.9),
            dealPrice: rawPrice,
            auctionPrice: auctionPrice,
            ratio: ratioPercent,
            profit: profit,
            profitRate: Math.round((profit / auctionPrice) * 100),
            kbPrice: kbPrice,
            officialPrice: officialPrice,
            dealDate: `${item.dealYear || dealYmd.substring(0, 4)}.${String(item.dealMonth || dealYmd.substring(4, 6)).padStart(2, '0')}.${String(item.dealDay || '10').padStart(2, '0')}`
          };
        });

        setRealTrades(formattedData);
        setStatusMessage(`CODEF 경매 사건 및 실거래 데이터 총 ${formattedData.length}건 분석 완료`);
      } else {
        setRealTrades([]);
        setStatusMessage('해당 조건에 일치하는 실거래 데이터가 없습니다.');
      }
    } catch (error) {
      console.error(error);
      setStatusMessage('백엔드 서버 통신 에러! (서버가 깨어나는 중일 수 있으니 10초 후 재시도하세요)');
    } finally {
      setLoading(false);
    }
  };

  // 조건 필터링
  const filteredData = realTrades.filter(item => item.ratio <= maxRatio);

  const totalCount = filteredData.length;
  const avgRatio = totalCount > 0 ? (filteredData.reduce((acc, cur) => acc + cur.ratio, 0) / totalCount).toFixed(1) : '0';
  const avgProfit = totalCount > 0 ? (filteredData.reduce((acc, cur) => acc + cur.profit, 0) / totalCount / 100000000).toFixed(2) : '0';

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 p-4 md:p-8 font-sans">
      {/* 헤더 */}
      <header className="mb-6 pb-4 border-b border-slate-800 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-600/30">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">PropValue</h1>
              <span className="bg-blue-950 text-blue-400 border border-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                수도권 경매&실거래 추적기 2.0
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">서울 · 경기 · 인천 CODEF 대법원 경매 및 실거래가 탐색</p>
          </div>
        </div>
      </header>

      {/* 요약 대시보드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#111827] p-4 rounded-xl border border-slate-800 flex justify-between items-center">
          <div>
            <p className="text-slate-400 text-xs font-medium">포착된 실거래 매물</p>
            <p className="text-2xl font-black text-sky-400 mt-1">{totalCount} <span className="text-sm font-normal text-slate-400">건</span></p>
          </div>
          <Building className="w-7 h-7 text-sky-400 opacity-80" />
        </div>

        <div className="bg-[#111827] p-4 rounded-xl border border-slate-800 flex justify-between items-center">
          <div>
            <p className="text-slate-400 text-xs font-medium">평균 실거래 대비 낙찰가율</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{avgRatio}%</p>
          </div>
          <TrendingUp className="w-7 h-7 text-emerald-400 opacity-80" />
        </div>

        <div className="bg-[#111827] p-4 rounded-xl border border-slate-800 flex justify-between items-center">
          <div>
            <p className="text-slate-400 text-xs font-medium">평균 예상 시세 차익</p>
            <p className="text-2xl font-black text-pink-400 mt-1">+{avgProfit}억원</p>
          </div>
          <DollarSign className="w-7 h-7 text-pink-400 opacity-80" />
        </div>
      </div>

      {/* 필터 바 */}
      <div className="bg-[#111827] p-5 rounded-2xl border border-slate-800 mb-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs font-bold text-slate-200 uppercase">수도권 지역 및 매물 검색 조건</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">1. 매물 종류</label>
            <div className="grid grid-cols-2 gap-1 bg-[#090d16] p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setPropertyType('apt')}
                className={`py-2 text-xs font-bold rounded-lg transition ${propertyType === 'apt' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                🏢 아파트
              </button>
              <button
                type="button"
                onClick={() => setPropertyType('villa')}
                className={`py-2 text-xs font-bold rounded-lg transition ${propertyType === 'villa' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
              >
                🏡 빌라/다세대
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">2. 수도권 지역 선택</label>
            <select 
              value={selectedRegion} 
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-[#090d16] border border-slate-700/80 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500"
            >
              {REGION_OPTIONS.map((reg) => (
                <option key={reg.code} value={reg.code}>{reg.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">3. 실거래 조회 연월 (YYYYMM)</label>
            <input 
              type="text" 
              value={dealYmd} 
              onChange={(e) => setDealYmd(e.target.value)}
              placeholder="예: 202405"
              className="w-full bg-[#090d16] border border-slate-700/80 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>4. 낙찰가율 조건</span>
              <span className="text-blue-400 font-bold">{maxRatio}% 이하</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="95" 
              value={maxRatio} 
              onChange={(e) => setMaxRatio(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <button 
            onClick={handleFetchData} 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/20"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            실거래 매물 탐색
          </button>
        </div>

        <div className="mt-3 text-xs text-blue-400 font-medium">
          상태: {statusMessage}
        </div>
      </div>

      {/* 테이블 목록 뷰 */}
      <div className="bg-[#111827] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-200">
            📋 실거래 매물 목록 ({filteredData.length}건)
          </h3>
          <span className="text-xs text-slate-500">행을 클릭하면 상세 평가 내역을 확인하실 수 있습니다.</span>
        </div>

        {filteredData.length > 0 ? (
          <div className="divide-y divide-slate-800/60 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
              <thead className="bg-[#090d16] text-slate-400 font-semibold uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">사건번호 (CODEF)</th>
                  <th className="py-3 px-4">매물명 및 층수</th>
                  <th className="py-3 px-4">전용면적</th>
                  <th className="py-3 px-4 text-right">추정 낙찰가</th>
                  <th className="py-3 px-4 text-right">최근 실거래가</th>
                  <th className="py-3 px-4 text-center">실거래 대비 비율</th>
                  <th className="py-3 px-4 text-center">상세보기</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredData.map((item) => (
                  <tr 
                    key={item.id} 
                    onClick={() => setSelectedItem(item)}
                    className="hover:bg-slate-800/50 cursor-pointer transition"
                  >
                    <td className="py-3.5 px-4 font-bold text-amber-400">{item.caseNo}</td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {item.name}
                      <span className="block text-[11px] text-slate-500 font-normal">{item.address}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{item.area}㎡</td>
                    <td className="py-3.5 px-4 text-right font-bold text-amber-300">
                      {(item.auctionPrice / 100000000).toFixed(2)}억원
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-400">
                      {(item.dealPrice / 100000000).toFixed(2)}억원
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="bg-blue-950 text-blue-400 border border-blue-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                        {item.ratio}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-500">
                      <ChevronRight className="w-4 h-4 mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <Building2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 text-sm font-semibold">조건에 일치하는 매물 데이터가 없습니다.</p>
            <p className="text-xs text-slate-500 mt-1">상단 필터 조건에서 조회 연월(예: 202405)이나 지역을 변경해보세요.</p>
          </div>
        )}
      </div>

      {/* 상세 보기 모달 */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-950 text-amber-400 border border-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                📌 CODEF 사건번호: {selectedItem.caseNo}
              </span>
              <span className="bg-slate-800 text-slate-300 text-[11px] px-2.5 py-0.5 rounded-md">
                {selectedItem.type}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-0.5">{selectedItem.name}</h3>
            <p className="text-xs text-slate-400 mb-5">{selectedItem.address} · 전용면적 {selectedItem.area}㎡</p>

            <div className="bg-[#090d16] p-4 rounded-xl border border-slate-800 space-y-2.5 mb-5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">⚡ 경매 추정 낙찰가</span>
                <span className="font-bold text-amber-400 text-sm">{(selectedItem.auctionPrice / 100000000).toFixed(2)}억원</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">🏢 최근 실거래가 ({selectedItem.dealDate})</span>
                <span className="font-bold text-emerald-400 text-sm">{(selectedItem.dealPrice / 100000000).toFixed(2)}억원</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-800/80 pt-2">
                <span className="text-slate-400">📈 KB 시세 추정가</span>
                <span className="font-bold text-sky-400">{(selectedItem.kbPrice / 100000000).toFixed(2)}억원</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">🏛️ 공시가격 추정가</span>
                <span className="font-bold text-slate-300">{(selectedItem.officialPrice / 100000000).toFixed(2)}억원</span>
              </div>
            </div>

            <div className="bg-blue-950/50 border border-blue-800/60 p-4 rounded-xl flex justify-between items-center mb-5">
              <div>
                <p className="text-[11px] text-blue-300">낙찰 시점 시세 차익</p>
                <p className="text-xl font-black text-blue-400">+{(selectedItem.profit / 100000000).toFixed(2)}억원</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-blue-300">수익률 (실거래가 대비)</p>
                <p className="text-lg font-bold text-emerald-400">+{selectedItem.profitRate}%</p>
              </div>
            </div>

            <button 
              onClick={() => setSelectedItem(null)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;