import type { Metadata } from 'next';
import { getVenuesByCategory, SITE_URL } from '../../lib/venues';
import { getCategoryContent, SITE_NAME } from '../../lib/gold-content';
import CategoryPage from '../../components/CategoryPage';

const cat = getCategoryContent('night');
const venues = getVenuesByCategory('night');

export const metadata: Metadata = {
  title: '나이트 추천 | 전국 58곳 완전 가이드 — 놀쿨', description: cat.description,
  alternates: { canonical: SITE_URL + '/nights/' },
  openGraph: { title: '나이트 추천 | 전국 58곳 완전 가이드 — 놀쿨', description: cat.description, url: SITE_URL + '/nights/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website', images: [{ url: SITE_URL + '/og/nights.png', width: 1200, height: 1200 }] },
};

export default function NightsPage() {
  return (
    <CategoryPage
      heading={cat.heading}
      intro={cat.intro}
      body="나이트는 테이블에 앉아 라이브 밴드의 연주를 들으며 사교하는 한국 고유의 밤문화다. 20대부터 60대까지 세대를 넘나드는 손님이 한 공간에 모이고, 밴드가 트로트부터 댄스·팝송까지 넘나들면 플로어 위에서 나이는 의미를 잃는다. 입장하면 웨이터가 자리를 배정해주고, 테이블에서 양주를 주문하는 것이 기본 시스템이다. 자리 위치에 따라 하루 저녁의 경험이 크게 달라지니, 일찍 도착해서 좋은 자리를 확보하는 것이 핵심이다. 서울에서는 수유·상봉·건대가 전통적 강세 지역이고, 경기권은 수원·성남·인덕원이 치열한 상권을 형성하고 있다. 부산 연산동은 남부 최대 격전지이며, 대전·광주·대구·전주·창원에도 20년 이상 역사를 가진 터줏대감급 나이트가 남아 있다. 복장은 깔끔한 캐주얼이면 충분하고, 신분증은 반드시 지참해야 한다. 금·토요일 22시 전후에 피크가 시작되므로 그 전에 도착하는 것이 좋다. 주차 가능 여부는 매장마다 다르니 방문 전 전화로 확인하자. 놀쿨에서 전국 58곳의 분위기·음악 스타일·접근성을 확인하고 나에게 맞는 곳을 골라보자."
      guide={{
        title: '처음 방문하세요?',
        items: [
          '입장하면 웨이터가 자리를 안내해준다. 따라가서 앉으면 된다',
          '양주 주문이 기본 시스템이다. 안주는 별도로 주문할 수 있다',
          '복장: 깔끔한 캐주얼이면 충분하다. 정장까지는 필요 없지만 단정하게 입자',
          '혼자 가면 카운터석이 편하고, 2인 이상이면 테이블을 추천한다',
          '피크타임 전인 22시 전후에 도착해야 좋은 자리를 확보할 수 있다',
          '신분증 없으면 입장 불가. 주민등록증·면허증·여권 중 하나를 반드시 지참하자',
          '귀가 교통편을 미리 확인해두자. 카카오T 앱 설치를 추천한다',
        ],
      }}
      timeslots={[
        { time: '평일 저녁', level: '여유', bar: '25%' },
        { time: '금요일 22~01시', level: '활발', bar: '80%' },
        { time: '토요일 22~01시', level: '피크', bar: '95%' },
        { time: '일요일', level: '한산', bar: '15%' },
      ]}
      venues={venues}
      catLabel="테이블 사교"
      year={new Date().getFullYear()}
    />
  );
}
