import type { Metadata } from 'next';
import { getVenuesByCategory, SITE_URL } from '../../lib/venues';
import { getCategoryContent, SITE_NAME } from '../../lib/gold-content';
import CategoryPage from '../../components/CategoryPage';

const cat = getCategoryContent('night');
const venues = getVenuesByCategory('night');

export const metadata: Metadata = {
  title: cat.title, description: cat.description,
  alternates: { canonical: SITE_URL + '/nights/' },
  openGraph: { title: cat.title, description: cat.description, url: SITE_URL + '/nights/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website', images: [{ url: '/og/nights.png', width: 1200, height: 630 }] },
};

export default function NightsPage() {
  return (
    <CategoryPage
      heading={cat.heading}
      intro={cat.intro}
      body="세대를 넘어 사람들이 모이는 곳이다. 20대부터 60대까지, 라이브 밴드 앞에서 춤추는 그 순간만큼은 나이가 의미 없다. 부스나 홀에 앉아 양주를 주문하고, 웨이터가 서비스를 제공한다. 자리 배치에 따라 하루 저녁의 경험이 달라지니 입장 후 위치 선정이 중요하다. 수유·상봉은 서울 전통 강세 지역이고, 수원·성남·인덕원은 경기권 격전지다. 부산 연산동과 대전, 광주, 대구에도 오랜 역사를 가진 곳이 많다. 피크타임은 금·토요일 자정 전후. 복장은 깔끔한 캐주얼이면 충분하다. 신분증은 반드시 지참하자. 전국을 하나하나 정리했다. 분위기는 어떤지, 어떤 음악이 나오는지, 주차는 되는지, 언제 가야 좋은지. 가기 전에 여기서 확인하라."
      guide={{
        title: '처음 방문하세요?',
        items: [
          '입장하면 웨이터가 자리를 안내한다. 따라가면 됨',
          '양주 주문이 기본. 안주는 별도로 주문한다',
          '복장: 깔끔한 캐주얼. 정장까지는 아니어도 단정하게',
          '혼자 가면 카운터석. 2인 이상이면 테이블 추천',
          '피크타임 전(22시 전후) 도착이 좋은 자리 확보의 핵심',
          '예산: 전화로 미리 문의하면 부담 없이 계획할 수 있다',
          '신분증 없으면 입장 불가. 주민등록증·면허증·여권 지참',
          '귀가 교통편 미리 확인. 카카오T 앱 설치 추천',
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
