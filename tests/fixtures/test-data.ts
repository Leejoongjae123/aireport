/**
 * 테스트용 더미 데이터
 */

export const testUsers = {
  client: {
    email: 'test-client@example.com',
    password: 'TestPassword123!',
    name: '테스트 클라이언트',
  },
  admin: {
    email: 'test-admin@example.com',
    password: 'AdminPassword123!',
    name: '테스트 관리자',
  },
};

export const testReportData = {
  title: '테스트 리포트 제목',
  description: '테스트 리포트 설명입니다.',
  content: '테스트 리포트 내용입니다.',
};

export const testExpertData = {
  name: '테스트 전문가',
  field: '인공지능',
  experience: '10년',
  description: '테스트 전문가 설명입니다.',
};

/**
 * 랜덤 이메일 생성
 */
export function generateRandomEmail(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `test-${timestamp}-${random}@example.com`;
}

/**
 * 랜덤 비밀번호 생성
 */
export function generateRandomPassword(): string {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}
