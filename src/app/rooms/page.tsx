import type { Metadata } from 'next';
import { getVenuesByCategory, SITE_URL } from '../../lib/venues';
import { getCategoryContent, SITE_NAME } from '../../lib/gold-content';
import CategoryPage from '../../components/CategoryPage';

const cat = getCategoryContent('room');
const venues = getVenuesByCategory('room');

export const metadata: Metadata = {
  title: '룸 추천 | 전국 2곳 완전 가이드', description: cat.description,
  alternates: { canonical: SITE_URL + '/rooms/' },
  openGraph: { title: '룸 추천 | 전국 2곳 완전 가이드', description: cat.description, url: SITE_URL + '/rooms/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website', images: [{ url: SITE_URL + '/og/rooms.png', width: 1200, height: 1200 }] },
};

export default function RoomsPage() {
  return (
    <CategoryPage
      heading={cat.heading}
      intro={cat.intro}
      body="룸은 문을 닫는 순간 오롯이 우리만의 공간이 되는, 프라이버시가 보장되는 밤문화 형태다. 비즈니스 접대에서 중요한 것은 대화의 격인데, 옆 테이블 소음이 없는 독립된 공간에서는 대화의 깊이가 달라진다. 회식, 동창 모임, 기념일, 생일 파티 등 격식과 자유가 동시에 필요한 자리에 가장 적합하다. 입장하면 전담 매니저가 배정되어 음료 주문부터 분위기 연출까지 세심하게 챙겨준다. 방 크기는 4인용 소형부터 20인 이상 대형까지 다양하므로, 인원수에 맞는 사이즈를 미리 확인하고 예약하는 것이 핵심이다. 방이 너무 크면 썰렁하고, 너무 작으면 답답하기 때문이다. 주요 상권은 일산·강남 일대이며, 주말 저녁은 빠르게 마감되니 최소 하루 전 예약이 필수다. 픽업이 되는 곳도 있으니 전화 문의 시 함께 확인하면 편리하다. 노래방 시설을 갖춘 곳도 있어 2차 이동 없이 한 공간에서 모임을 마무리할 수 있다는 것도 장점이다. 놀쿨에서 방 크기별 특징, 서비스 수준, 접근성을 비교하고 목적에 딱 맞는 공간을 선택하자."
      guide={{
        title: '처음이세요?',
        items: [
          '전화로 인원수와 목적을 미리 알리면 최적의 방 사이즈를 추천받을 수 있다',
          '주말 저녁은 빨리 마감된다. 최소 하루 전 사전 예약이 필수다',
          '접대 목적이라면 방 크기와 인테리어 분위기를 미리 확인하고 가는 것이 좋다',
          '전담 매니저가 배정되니 필요한 것이 있으면 바로 요청하면 된다',
          '픽업 서비스가 가능한 곳도 있다. 예약 시 전화로 함께 문의하자',
          '인원 변동이 있을 수 있으면 조금 넉넉한 사이즈의 방을 잡는 것이 편하다',
          '주차 가능 여부를 미리 확인하자. 대형 건물 내 위치한 곳은 주차가 수월하다',
        ],
      }}
      timeslots={[
        { time: '평일 저녁', level: '여유', bar: '40%' },
        { time: '금요일 19~22시', level: '활발', bar: '85%' },
        { time: '토요일 19~22시', level: '피크', bar: '95%' },
        { time: '일요일', level: '한산', bar: '15%' },
      ]}
      venues={venues}
      catLabel="프라이빗"
      year={new Date().getFullYear()}
    />
  );
}
