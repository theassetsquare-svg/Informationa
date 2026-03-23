import type { Metadata } from 'next';
import { getVenuesByCategory, SITE_URL } from '../../lib/venues';
import { getCategoryContent, SITE_NAME } from '../../lib/gold-content';
import CategoryPage from '../../components/CategoryPage';

const cat = getCategoryContent('club');
const venues = getVenuesByCategory('club');

export const metadata: Metadata = {
  title: cat.title, description: cat.description,
  alternates: { canonical: SITE_URL + '/clubs/' },
  openGraph: { title: cat.title, description: cat.description, url: SITE_URL + '/clubs/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website', images: [{ url: '/og/clubs.png', width: 1200, height: 630 }] },
};

export default function ClubsPage() {
  return (
    <CategoryPage
      heading={cat.heading}
      intro={cat.intro}
      body="단순한 춤추는 곳이 아니다. 조명이 바뀌는 순간, 음악이 몸을 감싸는 순간, 옆 사람과 눈이 마주치는 순간. 그 경험은 다른 어디에서도 느낄 수 없다. 강남은 대형 사운드 시스템과 VIP 공간이 밀집해 있고, 압구정·청담은 트렌디한 감각이 돋보인다. 홍대·이태원은 글로벌 DJ가 자주 찾는 인디 씬의 거점이다. 드레스코드가 있는 곳이 대부분이라 슬리퍼·트레이닝복은 입장이 제한된다. 피크타임은 금·토 자정 전후. 일찍 도착하면 대기 없이 입장할 수 있다. 전국에서 직접 다녀본 사람들의 솔직한 이야기를 모았다. 어디가 진짜 좋은지, 처음 가는 사람은 뭘 알아야 하는지. 밤키가 전부 정리했다."
      guide={{
        title: '처음이세요?',
        items: [
          '복장: 셔츠+깨끗한 신발이면 대부분 통과. 슬리퍼·반바지 NO',
          '준비물: 신분증(필수), 현금+카드, 보조배터리',
          '혼자 가도 됨. 바 카운터에 앉으면 자연스럽다',
          '피크타임: 금·토 23시~01시. 일찍 가면 대기 없음',
          '예산: 전화로 미리 확인하면 부담 없이 즐길 수 있다',
          '귀중품은 최소한으로. 소지품 분실 주의',
          '물을 충분히 마셔두면 다음 날 컨디션이 한결 낫다',
        ],
      }}
      timeslots={[
        { time: '금요일 22~24시', level: '활발', bar: '75%' },
        { time: '금요일 24~02시', level: '피크', bar: '95%' },
        { time: '토요일 23~02시', level: '붐빔', bar: '90%' },
        { time: '평일', level: '한산', bar: '20%' },
      ]}
      venues={venues}
      catLabel="플로어"
      year={new Date().getFullYear()}
    />
  );
}
