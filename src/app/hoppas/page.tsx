import type { Metadata } from 'next';
import { getVenuesByCategory, SITE_URL } from '../../lib/venues';
import { getCategoryContent, SITE_NAME } from '../../lib/gold-content';
import CategoryPage from '../../components/CategoryPage';

const cat = getCategoryContent('hoppa');
const venues = getVenuesByCategory('hoppa');

export const metadata: Metadata = {
  title: '호빠 추천 | 전국 15곳 완전 가이드 — 놀쿨', description: cat.description,
  alternates: { canonical: SITE_URL + '/hoppas/' },
  openGraph: { title: '호빠 추천 | 전국 15곳 완전 가이드 — 놀쿨', description: cat.description, url: SITE_URL + '/hoppas/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website', images: [{ url: SITE_URL + '/og/hoppas.png', width: 1200, height: 1200 }] },
};

export default function HoppasPage() {
  return (
    <CategoryPage
      heading={cat.heading}
      intro={cat.intro}
      body="호빠는 여성 손님이 주인공이 되는 프리미엄 나이트라이프 공간이다. 입장하면 매니저가 시스템을 안내하고, 테이블에 호스트가 배정되어 대화와 음료 서비스를 제공한다. 호스트 지명은 선택사항이며, 마음에 들지 않으면 교체를 요청할 수 있다. 2차 강요는 없고 본인이 원하는 만큼만 즐기면 된다. 이 점이 처음 방문하는 분들이 가장 궁금해하는 부분인데, 강압적인 분위기는 전혀 없으니 안심해도 된다. 안전 면에서도 대부분의 업소에 CCTV와 보안 인력이 상주하며, 문제 상황 발생 시 매니저가 즉시 대응한다. 주요 상권은 강남·역삼이 가장 크고, 부산 서면·해운대, 장안동, 건대입구 순으로 선택지가 다양하다. 지역마다 분위기가 다른데, 강남은 세련되고 모던한 인테리어가 많고, 부산은 활기차고 친근한 분위기가 특징이다. 친구와 함께 가는 경우가 많지만 혼자 방문해도 전혀 어색하지 않도록 호스트가 자연스럽게 대화를 이끌어준다. 금·토 23시 전후가 가장 붐비는 시간대이고, 평일 저녁은 한적하게 여유를 즐기기 좋다. 놀쿨에서 전국 15곳의 시스템과 분위기를 미리 파악하고, 편안한 첫 방문을 준비하자."
      guide={{
        title: '처음이세요? 걱정 마세요',
        items: [
          '입장하면 매니저가 시스템을 처음부터 설명해준다. 모르는 것은 바로 물어보자',
          '호스트 지명은 선택사항이다. 마음에 들지 않으면 교체 요청이 가능하다',
          '복장: 평소처럼 편하게 입으면 된다. 드레스코드가 없는 곳이 대부분이다',
          '2차 강요는 없다. 본인이 원하는 만큼만 즐기고 편하게 귀가하면 된다',
          '안전: 대부분 CCTV와 보안 인력이 상주한다. 불편한 상황은 매니저에게 즉시 알리자',
          '친구와 함께 가도 좋고, 혼자 가도 호스트가 자연스럽게 분위기를 만들어준다',
          '방문 전 전화로 시스템과 운영 시간을 확인하면 더 편안하게 즐길 수 있다',
        ],
      }}
      timeslots={[
        { time: '금요일 21~23시', level: '활발', bar: '80%' },
        { time: '금요일 23~01시', level: '피크', bar: '95%' },
        { time: '토요일 22~01시', level: '붐빔', bar: '85%' },
        { time: '평일 저녁', level: '여유', bar: '35%' },
      ]}
      venues={venues}
      catLabel="여성을 위한"
      year={new Date().getFullYear()}
      isHoppa={true}
    />
  );
}
