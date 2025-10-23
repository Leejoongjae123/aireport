import Image from "next/image";
import { Button } from "@/components/ui/Button";
import FAQSection from "./components/FAQSection";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="flex h-[1021px] flex-col items-center overflow-hidden relative hero-container mt-[131px]">
        {/* Hero Content */}
        <div className="mt-[97px] flex h-[287px] w-[884px] flex-col items-center gap-[33px] z-10">
          <div className="flex flex-col items-center gap-[14px] self-stretch">
            <h1 className="self-stretch text-center text-[52px] font-bold leading-[72px] text-[#1A1A1A]">
              AI 사업보고서를
              <br />
              5분 만에 생성해보세요
            </h1>
            <p className="self-stretch text-center text-2xl font-normal leading-8 text-[#303030]">
              AI 기반 보고서 자동 생성, 전문가 피드백, 컨설팅까지 한 번에!
            </p>
          </div>

          <Link href="/report/start">
            <Button className="flex items-center justify-center gap-2 rounded-[10px] bg-[#0077FF] w-[224px] h-[64px] hover:bg-[#0077FF]/90">
              <span className="text-lg font-bold text-white tracking-[-0.36px]">
                지금 시작하기
              </span>

              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 12L13 18M19 12L13 6M19 12L5 12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </Link>
        </div>

        <Image
          src="/images/hero1.png"
          alt="Hero Background"
          fill
          className="object-cover w-full aspect-[1208/924] z-5"
        />
      </div>

      {/* Logos Section */}
      <div className="flex w-full justify-center">
        <div className="flex w-[1150px] flex-col items-center">
          {/* <div className="flex items-start gap-[70px] py-[60px] opacity-40">
            <img src="https://api.builder.io/api/v1/image/assets/TEMP/eecd72375b4177cf11c7b57d2eb93c9541917f78?width=416" alt="Company Logo" className="h-[61px] w-[208px]" />
            <img src="https://api.builder.io/api/v1/image/assets/TEMP/eecd72375b4177cf11c7b57d2eb93c9541917f78?width=416" alt="Company Logo" className="h-[61px] w-[208px]" />
            <img src="https://api.builder.io/api/v1/image/assets/TEMP/eecd72375b4177cf11c7b57d2eb93c9541917f78?width=416" alt="Company Logo" className="h-[61px] w-[208px]" />
            <img src="https://api.builder.io/api/v1/image/assets/TEMP/eecd72375b4177cf11c7b57d2eb93c9541917f78?width=416" alt="Company Logo" className="h-[61px] w-[208px]" />
          </div> */}

          {/* Features Section */}
          <div className="flex flex-col items-center gap-[52px] self-stretch py-[120px]">
            <h2 className="w-[1010px] text-center text-[44px] font-bold leading-[60px] text-[#1A1A1A]">
              보고서를 쓰는 시간,
              <br />
              이제는 아이디어에 투자하세요
            </h2>

            <div className="flex flex-col items-start gap-[142px] self-stretch">
              {/* Feature 1: AI Report Generator */}
              <div className="flex items-center gap-x-12">
                {/* <Image src="/images/main_banner1.png" alt="Feature 1" width={300} height={100}></Image> */}
                {/* <svg
                  width="558"
                  height="372"
                  viewBox="0 0 558 372"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M374.751 81H159.249C154.141 81 150 85.141 150 90.2491V240.751C150 245.859 154.141 250 159.249 250H374.751C379.859 250 384 245.859 384 240.751V90.2491C384 85.141 379.859 81 374.751 81Z"
                    fill="white"
                    stroke="#E1E4E5"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M209 286H325M242.698 268H291.299"
                    stroke="#E1E4E5"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M97.1619 121.475L108.084 113.849L156.65 112V133.261L170.36 138.346H182.676L185 191.961L182.676 214.147L175.008 216.92L158.742 219L108.084 216.92L100.648 208.138L96 147.821L97.1619 121.475Z"
                    fill="#0077FF"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M113.556 107C101.651 107 92 116.605 92 128.455V203.545C92 215.394 101.651 225 113.556 225H167.444C179.349 225 189 215.394 189 203.545V137.341C189 131.651 186.729 126.194 182.687 122.17L173.758 113.284C169.715 109.26 164.233 107 158.516 107H113.556ZM175.066 129.756C176.216 130.9 177.09 132.289 177.624 133.818H167.444C164.468 133.818 162.056 131.417 162.056 128.455V118.322C163.592 118.854 164.987 119.725 166.137 120.869L175.066 129.756Z"
                    fill="#0077FF"
                  />
                  <path
                    d="M123 172.5L133.636 183L162 155"
                    stroke="white"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M240.333 107C228.551 107 219 116.605 219 128.455V203.545C219 215.394 228.551 225 240.333 225H293.667C305.449 225 315 215.394 315 203.545V137.341C315 131.651 312.752 126.194 308.752 122.17L299.915 113.284C295.914 109.26 290.488 107 284.83 107H240.333ZM301.209 129.756C302.347 130.9 303.213 132.289 303.741 133.818H293.667C290.721 133.818 288.333 131.417 288.333 128.455V118.322C289.854 118.854 291.235 119.725 292.373 120.869L301.209 129.756Z"
                    fill="#0077FF"
                  />
                  <path
                    d="M249 172.5L259.636 183L288 155"
                    stroke="white"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M366.556 107C354.651 107 345 116.605 345 128.455V203.545C345 215.394 354.651 225 366.556 225H420.444C432.349 225 442 215.394 442 203.545V137.341C442 131.651 439.729 126.194 435.687 122.17L426.758 113.284C422.715 109.26 417.233 107 411.516 107H366.556ZM428.066 129.756C429.216 130.9 430.09 132.289 430.624 133.818H420.444C417.468 133.818 415.056 131.417 415.056 128.455V118.322C416.592 118.854 417.987 119.725 419.137 120.869L428.066 129.756Z"
                    fill="#0077FF"
                  />
                  <path
                    d="M375 172.5L385.636 183L414 155"
                    stroke="white"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg> */}
                <Image
                  src="/images/main_banner1.png"
                  alt="Feature 1"
                  width={500}
                  height={400}
                ></Image>
                <div className="flex w-[590px] flex-col items-start gap-6">
                  <div className="flex flex-col items-start gap-3 self-stretch">
                    <h3 className="self-stretch text-4xl font-bold leading-[50px] tracking-[-0.72px] text-[#303030]">
                      AI Report Generator
                    </h3>
                    <p className="self-stretch text-xl font-normal leading-[30px] text-[#5A5A5A]">
                      단순 입력만으로도 전문적인 사업보고서를 자동 생성합니다.
                      <br />
                      업종/목표투자/핵심가치를 입력하면 5분 만에 초안이
                      완성됩니다.
                    </p>
                  </div>
                  <button className="flex items-center gap-2 rounded-md bg-[#0077FF] px-6 py-3">
                    <span className="text-base font-semibold text-white">
                      지금 시작하기
                    </span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 12L13 18M19 12L13 6M19 12L5 12"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Feature 2: AI Diagnosis & Insights */}
              <div className="flex items-center">
                <div className="flex w-[590px] flex-col items-start gap-6">
                  <div className="flex flex-col items-start gap-3 self-stretch">
                    <h3 className="self-stretch text-4xl font-bold leading-[50px] tracking-[-0.72px] text-[#303030]">
                      AI Diagnosis & Insights
                    </h3>
                    <p className="self-stretch text-xl font-normal leading-[30px] text-[#5A5A5A]">
                      생성된 보고서를 AI가 자동으로 분석하고 점수화합니다.
                      <br />
                      항목별 피드백과 개선 가이드를 통해 보고서를 더 완성도 있게
                      <br />
                      다듬을 수 있습니다.
                    </p>
                  </div>
                  <button className="flex items-center gap-2 rounded-md bg-[#0077FF] px-6 py-3">
                    <span className="text-base font-semibold text-white">
                      지금 시작하기
                    </span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 12L13 18M19 12L13 6M19 12L5 12"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                <Image
                  src="/images/main_banner2.png"
                  alt="Feature 2"
                  width={400}
                  height={300}
                />
              </div>

              {/* Feature 3: Expert Evaluation */}
              <div className="flex items-center gap-16 ">
                {/* <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/0e6b3dc02d840114d831c900856abe3284fba3a9?width=1116"
                  alt="Expert Evaluation"
                  className="h-[372px] w-[558px]"
                /> */}
                <Image
                  src="/images/main_banner3.png"
                  alt="Feature 2"
                  width={600}
                  height={300}
                ></Image>
                <div className="flex w-[590px] flex-col items-start gap-6">
                  <div className="flex w-[590px] flex-col items-start gap-3">
                    <h3 className="self-stretch text-4xl font-bold leading-[50px] tracking-[-0.72px] text-[#303030]">
                      Expert Evaluation
                    </h3>
                    <p className="self-stretch text-xl font-normal leading-[30px] text-[#5A5A5A]">
                      업계 전문가에게 직접 평가를 요청하세요.
                      <br />
                      전문가의 학력/경력/분야에 기반한 피드백을 받고,
                      <br />
                      필요 시 컨설팅까지 연계할 수 있습니다.
                    </p>
                  </div>
                  <button className="flex items-center gap-2 rounded-md bg-[#0077FF] px-6 py-3">
                    <span className="text-base font-semibold text-white">
                      지금 시작하기
                    </span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 12L13 18M19 12L13 6M19 12L5 12"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <footer className="relative h-[236px] self-stretch bg-[#121212]">
        {/* Decorative Star */}
        {/* <svg
          width="571"
          height="577"
          viewBox="0 0 571 577"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-[115.846px] top-[-692.672px] h-[490.328px] w-[490.328px]"
        >
          <g filter="url(#filter0_f_900_2969)">
            <path
              d="M309.683 159.511C322.393 144.889 346.389 155.074 344.701 174.375L339.492 233.906C338.737 242.538 343.626 250.674 351.602 254.059L406.609 277.409C424.444 284.979 422.172 310.948 403.294 315.306L345.067 328.749C336.625 330.698 330.397 337.862 329.642 346.493L324.434 406.024C322.745 425.325 297.345 431.189 287.367 414.582L256.589 363.359C252.126 355.932 243.389 352.223 234.947 354.172L176.72 367.615C157.842 371.973 144.416 349.629 157.127 335.006L196.332 289.906C202.016 283.367 202.843 273.911 198.381 266.484L167.603 215.261C157.624 198.654 174.727 178.98 192.561 186.55L247.569 209.9C255.544 213.285 264.793 211.15 270.478 204.611L309.683 159.511Z"
              fill="#F0F0F0"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_900_2969"
              x="0.139404"
              y="0.575684"
              width="570.659"
              height="575.727"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="76"
                result="effect1_foregroundBlur_900_2969"
              />
            </filter>
          </defs>
        </svg> */}

        {/* <div className="absolute bottom-[118.205px] w-[212px] text-center text-4xl font-bold leading-[160%] text-[#A6A6A6]">
          LOGO
        </div> */}
        <div className="absolute top-[50px] left-[60px] text-center text-4xl font-bold leading-[160%] text-[#A6A6A6]">
          <Image
            src="/images/logo.svg"
            alt="logo"
            width={150}
            height={100}
          ></Image>
        </div>
        <div className="absolute bottom-[25px] left-[60px] h-[26px] w-[187px] text-base font-normal leading-[160%] text-[#A6A6A6]">
          © 2025 레포트 어시스턴트
        </div>

        <div className="absolute bottom-[120px] right-[97px] h-[26px] w-[179px] text-base font-normal leading-[160%] text-[#A6A6A6]">
          개인정보처리방침 | 이용약관
        </div>

        <div className="absolute bottom-[32px] right-[92px] text-right text-base font-normal leading-[160%] text-[#A6A6A6]">
          대표자명 : 홍길동 사업자등록번호 : 123-12-12345 주소 : 서울시 강남구
          테헤란로 123
          <br />
          대표전화 : 02-123-1234 이메일 : absd123@anchor.com
        </div>
      </footer>
    </>
  );
}
