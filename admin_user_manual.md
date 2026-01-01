# AI 사업계획서 관리자 매뉴얼

본 매뉴얼은 AI 사업계획서 플랫폼의 관리자 페이지 사용 방법을 안내합니다.

## 1. 관리자 로그인

관리자 페이지에 접속하기 위해서는 로그인이 필요합니다.

- **접속 주소**: `/admin/login`
- **계정 ID**: `ljj3347@naver.com`
- **비밀번호**: `dlwndwo2`

![관리자 로그인 페이지](./admin_manual_assets/admin_login_page_1763955769030.png)

## 2. 대시보드 (Dashboard)

로그인 후 처음 접속되는 화면으로, 전체적인 현황을 파악할 수 있습니다.

![관리자 대시보드](./admin_manual_assets/admin_dashboard_1763955794440.png)

## 3. 회원 관리 (Members)

가입된 회원들의 목록을 조회하고 관리할 수 있는 페이지입니다.

![회원 관리 목록](./admin_manual_assets/admin_members_list_1763955810037.png)

## 4. 보고서 생성 관리 (Reports)

사용자들이 생성한 AI 사업계획서 보고서 목록을 확인하고 관리합니다.

![보고서 생성 관리 목록](./admin_manual_assets/admin_reports_list_1763955829004.png)

## 5. 요청 관리 (Requests)

전문가에게 요청된 평가 및 컨설팅 내역을 관리합니다.

### 5.1 전문가 평가 요청

전문가 평가 요청 목록을 확인합니다.

![전문가 평가 요청 목록](./admin_manual_assets/admin_eval_requests_list_1763955849031.png)

리스트의 항목을 클릭하여 상세 내용을 확인할 수 있습니다.

![전문가 평가 요청 상세](./admin_manual_assets/admin_eval_request_detail_1763955855937.png)

### 5.2 전문가 컨설팅 요청

전문가 컨설팅 요청 목록을 확인합니다.

![전문가 컨설팅 요청 목록](./admin_manual_assets/admin_consult_requests_list_1763955887381.png)

리스트의 항목을 클릭하여 상세 내용을 확인할 수 있습니다.

![전문가 컨설팅 요청 상세](./admin_manual_assets/admin_consult_request_detail_1763955893624.png)

## 6. 임베딩 관리 (Embeddings)

RAG(Retrieval-Augmented Generation)를 위한 데이터 임베딩을 관리합니다.

### 6.1 보고서 임베딩

참조할 보고서 데이터를 관리합니다.

![보고서 임베딩 목록](./admin_manual_assets/admin_report_embeddings_list_1763955921844.png)

'보고서 등록' 버튼을 통해 새로운 보고서 데이터를 등록하거나 수정할 수 있습니다.

![보고서 임베딩 등록/수정](./admin_manual_assets/admin_report_embedding_edit_1763955929001.png)

### 6.2 전문가 정보 임베딩

전문가 매칭을 위한 전문가 정보를 관리합니다.

![전문가 정보 임베딩 목록](./admin_manual_assets/admin_expert_embeddings_list_1763955947599.png)

'전문가 등록' 버튼을 통해 새로운 전문가 정보를 등록하거나 수정할 수 있습니다.

![전문가 정보 등록/수정](./admin_manual_assets/admin_expert_embedding_edit_1763955999979.png)
