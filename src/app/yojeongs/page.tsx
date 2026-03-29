import type { Metadata } from 'next';
import { getVenuesByCategory, SITE_URL } from '../../lib/venues';
import { getCategoryContent, SITE_NAME } from '../../lib/gold-content';
import CategoryPage from '../../components/CategoryPage';

const cat = getCategoryContent('yojeong');
const venues = getVenuesByCategory('yojeong');

export const metadata: Metadata = {
  title: '요정 추천 | 전국 1곳 완전 가이드 — 놀쿨', description: cat.description,
  alternates: { canonical: SITE_URL + '/yojeongs/' },
  openGraph: { title: '요정 추천 | 전국 1곳 완전 가이드 — 놀쿨', description: cat.description, url: SITE_URL + '/yojeongs/', siteName: SITE_NAME, locale: 'ko_KR', type: 'website', images: [{ url: SITE_URL + '/og/yojeongs.png', width: 1200, height: 1200 }] },
};

export default function YojeongsPage() {
  return (
    <CategoryPage
      heading={cat.heading}
      intro={cat.intro}
      body="요정은 한정식 코스 요리와 국악 라이브 공연이 어우러지는 한국 전통 접대 문화의 정수다. 일반 음식점이나 룸과 근본적으로 다른 점은, 음식·공연·공간·서비스가 하나의 흐름으로 설계되어 있다는 것이다. 한복을 입은 기녀가 가야금이나 판소리를 연주하고, 한정식 코스가 순서대로 나오며, 프라이빗 좌석에서 격식을 갖춘 대화가 이루어진다. 비즈니스 접대에서 상대방에게 색다른 인상을 남기고 싶을 때, 해외 손님에게 한국 문화를 소개하고 싶을 때, 중요한 기념일에 격조 있는 자리를 마련하고 싶을 때 요정만 한 선택이 없다. 대부분 완전 예약제로 운영되며, 방문 최소 이틀 전에는 예약해야 원하는 날짜와 시간을 확보할 수 있다. 한정식 코스는 제철 식재료를 활용해 구성되므로 방문 시기에 따라 메뉴가 달라지는 것도 특징이다. 알레르기나 식이 제한이 있다면 예약 시 미리 알려주면 대응해준다. 주차 공간이 넓은 곳이 많아 차량 방문이 편리하고, 발렛 서비스를 제공하는 곳도 있다. 놀쿨에서 요정의 코스 구성, 공연 일정, 좌석 배치를 확인하고, 잊히지 않을 자리를 준비해보자."
      guide={{
        title: '처음이세요?',
        items: [
          '반드시 사전 예약이 필요하다. 당일 워크인은 거의 불가능하니 최소 이틀 전에 연락하자',
          '복장: 격식 있게 입자. 정장이나 깔끔한 비즈니스 캐주얼이 기본이다',
          '한정식 코스가 기본이다. 알레르기가 있으면 예약 시 미리 알려주자',
          '국악 공연 여부와 일정은 전화로 별도 확인이 필요하다',
          '접대 목적이면 좌석 배치와 동선을 사전에 확인해 상석 위치를 파악하자',
          '해외 손님 동반 시 통역이나 문화 설명이 필요하면 미리 상의하자',
          '코스 요리는 시간이 걸리므로 여유 있는 일정으로 방문하는 것이 좋다',
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
