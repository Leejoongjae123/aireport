export default function AgreementContent() {
  return (
    <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
      <h1 className="text-2xl font-bold mb-4">레포트 어시스턴트 이용약관</h1>

      <div className="mb-6">
        <p className="text-sm text-gray-700">
          ㈜레인아이(이하 &quot;회사&quot;)는 「전자상거래 등에서의 소비자보호에 관한 법률」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 준수하며, 본 약관은 회사가 운영하는 레포트 어시스턴트(이하 &quot;서비스&quot;)의 이용 조건, 절차 및 회사와 회원 간의 권리·의무 사항을 규정함을 목적으로 합니다.
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-3">제1조(목적)</h2>
      <p className="text-sm text-gray-700 mb-6">
        ① 이 약관은 회사가 제공하는 서비스의 이용 조건과 절차, 회원의 권리·의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
      </p>

      <h2 className="text-xl font-semibold mb-3">제2조(정의)</h2>
      <p className="text-sm text-gray-700 mb-2">① 본 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
      <ul className="list-decimal pl-6 mb-6 space-y-2 text-sm text-gray-700">
        <li>&quot;서비스&quot;란 회사가 제공하는 AI 기반 문서 작성, 저장, 비교, 전문가 피드백 및 관련 부가 기능 일체를 말합니다.</li>
        <li>&quot;회원&quot;이란 본 약관에 동의하고 서비스를 이용하는 개인 또는 법인을 말합니다.</li>
        <li>&quot;AI 생성물&quot;이란 회원이 AI 기능을 이용하여 생성한 문서, 결과물 등을 말합니다.</li>
        <li>&quot;전문가 피드백&quot;이란 전문가가 회원의 요청에 따라 제공하는 검토 및 자문 서비스를 말합니다.</li>
        <li>&quot;계정정보&quot;란 회원 식별 및 서비스 이용을 위해 필요한 이메일, 비밀번호 등의 정보를 말합니다.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-3">제3조(약관의 효력 및 개정)</h2>
      <ul className="list-none pl-0 mb-6 space-y-2 text-sm text-gray-700">
        <li>① 본 약관은 회사가 서비스 초기 화면 또는 연결 화면에 게시하여 이용자가 열람할 수 있도록 함으로써 효력이 발생합니다.</li>
        <li>② 회사는 관련 법령을 위반하지 않는 범위 내에서 본 약관을 개정할 수 있습니다.</li>
        <li>③ 약관이 개정될 경우, 회사는 개정 내용과 시행일을 명시하여 시행 7일 전부터 공지합니다. 다만, 이용자에게 불리하거나 중대한 변경의 경우 최소 30일 전에 공지합니다.</li>
        <li>④ 회사는 개정 약관을 공지할 때 &quot;시행일까지 명시적 거부 의사를 표시하지 않으면 동의한 것으로 본다&quot;는 뜻을 함께 안내하며, 회원이 이에 대해 명시적 거부 의사를 표시하지 않은 경우 개정 약관에 동의한 것으로 간주합니다.</li>
        <li>⑤ 회사는 개정 약관의 공지를 서비스 화면, 이메일, SMS 등 다양한 방식으로 할 수 있습니다.</li>
        <li>⑥ 회원이 개정된 약관의 적용에 동의하지 않을 경우, 회원 탈퇴를 통해 이용계약을 해지할 수 있습니다.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-3">제4조(회원가입 및 계정관리)</h2>
      <ul className="list-none pl-0 mb-6 space-y-2 text-sm text-gray-700">
        <li>① 서비스는 로그인한 회원에게 제공됩니다.</li>
        <li>② 회원가입은 자체 계정 또는 외부 계정(구글, 카카오 등)을 통해 가능합니다.</li>
        <li>③ 회원은 본인 정보를 정확히 입력해야 하며, 허위 정보를 입력할 경우 서비스 이용이 제한될 수 있습니다.</li>
        <li>④ 회원 가입 시 회사는 휴대전화 또는 이메일 인증 등 본인 확인 절차를 진행합니다.</li>
        <li>⑤ 외부 계정을 통한 로그인 시 해당 외부 서비스의 개인정보 처리방침도 함께 적용되며, 회원은 이를 숙지해야 합니다.</li>
        <li>⑥ 계정정보는 회원 본인이 직접 관리해야 하며, 제3자에게 양도하거나 공유할 수 없습니다.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-3">제5조(서비스의 이용)</h2>
      <p className="text-sm text-gray-700 mb-2">① 회사는 다음 각 호의 서비스를 제공합니다.</p>
      <ul className="list-decimal pl-6 mb-4 space-y-1 text-sm text-gray-700">
        <li>AI 기반 문서 작성 및 편집 서비스</li>
        <li>문서 저장, 비교 및 관리 기능</li>
        <li>전문가 매칭 및 피드백 서비스</li>
        <li>기타 회사가 정한 부가 서비스</li>
      </ul>
      <ul className="list-none pl-0 mb-6 space-y-2 text-sm text-gray-700">
        <li>② 회사는 안정적인 서비스 제공을 위하여 시스템 점검 또는 개선 작업을 수행할 수 있습니다.</li>
        <li>③ 다음 각 호의 사유로 서비스가 일시 중단될 수 있으며, 회사는 가능한 한 신속히 복구 후 안내합니다.</li>
      </ul>
      <ul className="list-decimal pl-6 mb-4 space-y-1 text-sm text-gray-700">
        <li>시스템 점검, 교체 또는 오류 발생</li>
        <li>천재지변, 정전 등 불가항력적인 사유</li>
        <li>통신망 장애 또는 외부 서비스 장애</li>
      </ul>
      <ul className="list-none pl-0 mb-6 space-y-2 text-sm text-gray-700">
        <li>④ 회사는 서비스 변경이 필요한 경우 사전에 공지하며, 내용이 중요한 경우 회원의 동의를 받을 수 있습니다.</li>
        <li>⑤ 회사는 서비스 품질 향상 및 지속적 운영을 위하여 일부 기능을 유료로 제공할 수 있습니다.</li>
        <li>⑥ 유료 서비스 도입 시 회사는 이용요금, 결제방식, 환불정책 등을 사전에 명확히 고지합니다.</li>
        <li>⑦ 서비스 내 AI가 생성한 문서 및 결과물은 참고 자료용으로 제공되며, 회사는 해당 결과물의 정확성이나 법적 책임을 보증하지 않습니다.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-3">제6조(개인정보 및 데이터의 처리)</h2>
      <ul className="list-none pl-0 mb-6 space-y-2 text-sm text-gray-700">
        <li>① 회사는 「개인정보 보호법」 등 관계 법령을 준수하며, 개인정보 처리에 관한 자세한 내용은 개인정보처리방침에 따릅니다.</li>
        <li>② 회사는 회원으로부터 명시적 동의를 받은 데이터에 한하여 비식별화 과정을 거쳐 AI 알고리즘 학습 및 서비스 개선에 활용합니다.</li>
        <li>③ 회사는 비식별화된 데이터를 통계, 서비스 품질 향상, 모델 고도화 등의 목적으로 활용할 수 있습니다.</li>
        <li>④ 회원의 부주의로 인한 정보 유출에 대하여 회사는 책임을 지지 않습니다.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-3">제7조(AI 생성물의 이용 및 권리)</h2>
      <ul className="list-none pl-0 mb-6 space-y-2 text-sm text-gray-700">
        <li>① 회원은 AI 생성물을 비독점적·양도불가한 범위 내에서 자유롭게 활용할 수 있습니다.</li>
        <li>② 회사는 서비스 품질 개선을 위해 비식별화된 형태로 생성물을 분석·활용할 수 있습니다.</li>
        <li>③ AI 생성물은 자동 생성된 결과이므로 정확성이나 완전성이 보장되지 않으며, 그 활용 책임은 회원에게 있습니다.</li>
        <li>④ 회원은 다음 각 호의 행위를 해서는 안 됩니다.</li>
      </ul>
      <ul className="list-decimal pl-6 mb-4 space-y-1 text-sm text-gray-700">
        <li>AI 생성물을 제3자에게 재판매·재배포하거나 상업적으로 재이용하는 행위</li>
        <li>생성물을 타 AI 모델의 학습용 데이터로 제공하거나 판매하는 행위</li>
        <li>회사의 명시적 허락 없이 생성물을 서비스 주요 콘텐츠로 활용하는 행위</li>
      </ul>
      <p className="text-sm text-gray-700 mb-6">⑤ 위반이 확인될 경우 회사는 관련 법령에 따라 이용 제한 등의 조치를 할 수 있습니다.</p>

      <h2 className="text-xl font-semibold mb-3">제8조(전문가 피드백)</h2>
      <ul className="list-none pl-0 mb-6 space-y-2 text-sm text-gray-700">
        <li>① 회사는 회원 요청에 따라 전문가를 추천하거나 연결할 수 있습니다.</li>
        <li>② 전문가 피드백은 전문가 개인의 견해로 제공되며, 회사의 공식 입장이 아닙니다.</li>
        <li>③ 회사는 전문가의 자문 내용이나 판단 결과에 대하여 법적 책임을 부담하지 않습니다.</li>
        <li>④ 회원과 전문가 간의 교류·거래로 발생한 분쟁은 당사자 간에 해결해야 합니다.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-3">제9조(회원의 의무)</h2>
      <p className="text-sm text-gray-700 mb-2">① 회원은 다음 각 호의 사항을 준수하여야 합니다.</p>
      <ul className="list-decimal pl-6 mb-6 space-y-1 text-sm text-gray-700">
        <li>타인의 정보 도용 또는 부정한 목적의 이용 금지</li>
        <li>계정정보의 안전한 관리</li>
        <li>회사 및 제3자의 지식재산권 침해 금지</li>
        <li>법령 또는 공공질서에 반하는 콘텐츠 게시 금지</li>
        <li>서비스 운영을 방해하거나 서버·보안을 침해하는 행위 금지</li>
      </ul>

      <h2 className="text-xl font-semibold mb-3">제10조(회원 탈퇴 및 이용 제한)</h2>
      <ul className="list-none pl-0 mb-6 space-y-2 text-sm text-gray-700">
        <li>① 회원은 언제든지 서비스 내 메뉴를 통해 탈퇴할 수 있습니다.</li>
        <li>② 탈퇴 후 회원의 데이터는 복구되지 않으며, 법령에 따라 일정 기간 보관 후 삭제됩니다.</li>
        <li>③ 회사는 회원이 약관 또는 법령을 위반한 경우 사전 안내 후 서비스 이용을 제한할 수 있습니다.</li>
        <li>④ 위반이 중대한 경우 회사는 사전 통보 없이 계정을 해지할 수 있습니다.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-3">제11조(지식재산권)</h2>
      <ul className="list-none pl-0 mb-6 space-y-2 text-sm text-gray-700">
        <li>① 서비스와 관련된 모든 프로그램, UI, 디자인, 데이터베이스 등의 권리는 회사에 귀속됩니다.</li>
        <li>② 회원은 회사의 서면 동의 없이 서비스를 복제, 배포, 개작하거나 영리 목적으로 사용할 수 없습니다.</li>
        <li>③ AI 생성물의 권리는 회원에게 귀속되며, 회사는 서비스 개선을 위한 비식별화된 데이터 분석에 한해 활용할 수 있습니다.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-3">제12조(손해배상 및 면책)</h2>
      <p className="text-sm text-gray-700 mb-2">① 회사는 고의 또는 중대한 과실이 없는 한 서비스 이용과 관련한 손해배상 책임을 지지 않습니다.</p>
      <p className="text-sm text-gray-700 mb-2">② 다음 각 호의 사유로 발생한 손해에 대하여 회사는 책임을 부담하지 않습니다.</p>
      <ul className="list-decimal pl-6 mb-4 space-y-1 text-sm text-gray-700">
        <li>천재지변, 정전, 통신장애 등 불가항력적 사유</li>
        <li>회원의 과실 또는 관리 소홀</li>
        <li>AI 생성물의 부정확성, 오류, 누락</li>
        <li>전문가 피드백의 판단 착오</li>
      </ul>
      <p className="text-sm text-gray-700 mb-6">③ 회원이 본 약관을 위반하여 회사에 손해를 입힌 경우, 회원은 해당 손해를 배상하여야 합니다.</p>

      <h2 className="text-xl font-semibold mb-3">제13조(문의 및 고객지원)</h2>
      <ul className="list-none pl-0 mb-6 space-y-2 text-sm text-gray-700">
        <li>① 회사는 회원의 문의, 건의, 불편사항을 접수하기 위한 고객지원 창구를 운영합니다.</li>
        <li>② 회원은 서비스 내 문의 기능 또는 이메일(support@reportai.io)을 통해 문의할 수 있습니다.</li>
        <li>③ 회사는 신속한 처리를 위하여 노력하며, 지연 시 사유 및 처리 일정을 안내합니다.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-3">제14조(분쟁 해결 및 준거법)</h2>
      <ul className="list-none pl-0 mb-6 space-y-2 text-sm text-gray-700">
        <li>① 회사와 회원은 분쟁 발생 시 성실히 협의하여 원만히 해결하기 위해 노력합니다.</li>
        <li>② 협의가 이루어지지 않을 경우 대한민국 법률을 준거법으로 하며, 회사 본사 소재지 관할 법원을 제1심 법원으로 합니다.</li>
        <li>③ 회원은 자신의 주소지 관할 법원에도 소송을 제기할 수 있습니다.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-3">[부칙]</h2>
      <p className="text-sm text-gray-700 mb-6">이 약관은 2025년 10월 00일부터 시행합니다.</p>
    </div>
  );
}
