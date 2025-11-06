# 배포 환경 인증 문제 해결 체크리스트

## 현재 상황
- 로컬: 정상 작동 ✅
- 배포(Vercel): 로그인은 되지만 보호된 경로 접근 시 계속 로그인 페이지로 리다이렉트 ❌

## 문제 원인
middleware에서 `supabase.auth.getUser()`가 사용자를 인식하지 못함 (쿠키 문제)

## 해결 단계

### 1. Supabase 대시보드 설정 (가장 중요!)

**Authentication > URL Configuration**으로 이동:

1. **Site URL** 설정:
   ```
   https://aireport-chi.vercel.app
   ```

2. **Redirect URLs** 추가:
   ```
   https://aireport-chi.vercel.app/**
   https://aireport-chi.vercel.app/api/auth/callback
   https://aireport-chi.vercel.app/register/complete
   ```

3. **Additional Redirect URLs**에도 동일하게 추가

### 2. Vercel 환경 변수 확인

Vercel Dashboard > Settings > Environment Variables:

```env
NEXT_PUBLIC_SITE_URL=https://aireport-chi.vercel.app
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_anon_key
```

**중요**: 환경 변수 변경 후 반드시 재배포 필요!

### 3. Supabase Auth Settings 확인

**Authentication > Settings**:

- **Enable email confirmations**: OFF (개발 중이라면)
- **Secure email change**: ON
- **Enable phone confirmations**: OFF

**Cookie Options**:
- **SameSite**: Lax (권장)
- **Secure**: ON (HTTPS 사용 시)

### 4. 배포 후 디버깅

1. Vercel 로그 확인:
   - Vercel Dashboard > Deployments > [최신 배포] > Functions
   - `[Middleware Debug]` 로그 찾기
   - `hasUser: false`가 나오면 쿠키 문제

2. 브라우저 개발자 도구:
   - Application > Cookies
   - `sb-[project-ref]-auth-token` 쿠키 확인
   - Domain이 `.vercel.app`로 설정되어 있는지 확인

### 5. 추가 확인 사항

만약 위 설정 후에도 문제가 계속되면:

1. **Supabase 프로젝트 재시작**:
   - Supabase Dashboard > Settings > General
   - Pause project → Resume project

2. **Vercel 캐시 클리어**:
   ```bash
   vercel --prod --force
   ```

3. **로컬에서 프로덕션 빌드 테스트**:
   ```bash
   npm run build
   npm start
   ```

### 6. 임시 해결책 (권장하지 않음)

만약 급하게 해결이 필요하다면, middleware에서 `/report/start` 경로만 인증 체크에서 제외:

```typescript
const protectedPaths = ["/report/editor", "/report/inputs", "/report/procedure", "/review", "/mypage"];
```

하지만 이는 보안 문제가 있으므로 근본적인 해결책이 아닙니다.

## 예상 원인

1. **Supabase Redirect URL 미설정**: 가장 가능성 높음
2. **쿠키 도메인 불일치**: Supabase가 쿠키를 잘못된 도메인에 설정
3. **환경 변수 누락**: NEXT_PUBLIC_SITE_URL 미설정
4. **Supabase 프로젝트 설정 오류**: Auth 설정 문제

## 확인 완료 후

- [ ] Supabase Site URL 설정 완료
- [ ] Supabase Redirect URLs 설정 완료
- [ ] Vercel 환경 변수 설정 완료
- [ ] Vercel 재배포 완료
- [ ] 로그인 테스트 완료
- [ ] 보호된 경로 접근 테스트 완료
- [ ] 디버깅 로그 제거 (배포 완료 후)
