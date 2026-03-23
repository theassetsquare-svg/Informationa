import type { Metadata } from 'next';
import { getVenuesByCategory, SITE_URL } from '../../lib/venues';
import { getCategoryContent, SITE_NAME } from '../../lib/gold-content';
import CategoryPage from '../../components/CategoryPage';

const cat = getCategoryContent('yojeong');
const venues = getVenuesByCategory('yojeong');

export const metadata: Metadata = {
  title: cat.title, description: cat.description,
  alternates: { canonical: SITE_URL + '/yojeongs/' },
  openGraph: { title: cat.title, description: cat.description, url: SITE_URL + '/yojeongs/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website', images: [{ url: '/og/yojeongs.png', width: 1200, height: 630 }] },
};

export default function YojeongsPage() {
  return (
    <CategoryPage
      heading={cat.heading}
      intro={cat.intro}
      body="한국 전통 문화를 경험하는 특별한 공간이다. 한정식에 국악 라이브, 고급스러운 분위기. 접대, 비즈니스, 특별한 모임에 이만한 곳이 없다. 한정식 코스가 기본이며, 국악 라이브 공연이 함께하는 곳도 있다. 프라이빗 좌석에서 격식을 갖추고 대화하는 자리에 적합하다. 대부분 예약제로 운영된다. 일산명월관은 코스 요리와 판소리 공연을 갖추고 있다. 접대의 격을 높이고 싶다면 여기서 확인하라."
      guide={{
        title: '처음이세요?',
        items: [
          '반드시 사전 예약. 당일 워크인은 거의 불가능하다',
          '복장: 격식 있게. 정장이나 깔끔한 비즈니스 캐주얼',
          '한정식 코스가 기본. 알레르기 있으면 미리 알려주자',
          '예산: 전화로 문의하면 코스 구성과 시스템을 안내받을 수 있다',
          '국악 공연이 있는 곳은 별도 문의. 특별한 자리에 어울린다',
          '접대 목적이면 좌석 배치와 동선을 미리 확인하자',
        ],
      }}
      timeslots={[
        { time: '평일 점심', level: '활발', bar: '60%' },
        { time: '평일 저녁', level: '붐빔', bar: '80%' },
        { time: '주말 저녁', level: '피크', bar: '95%' },
        { time: '주말 점심', level: '활발', bar: '70%' },
      ]}
      venues={venues}
      catLabel="한정식 풍류"
      year={new Date().getFullYear()}
    />
  );
}
