import apiClient from './apiClient';

// =================================================================
// HÀM GỌI API THẬT
// =================================================================

/**
 * Gửi yêu cầu đăng nhập đến server.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise} - Promise chứa response từ server.
 */
const loginWithApi = (email, password) => {
  // apiClient sẽ tự động thêm baseURL (vd: http://localhost:8080/api) vào trước '/auth/login'
  // và gửi đi một POST request với body chứa email và password.
  return apiClient.post('/auth/login', {
    email: email,
    password: password
  });
};

/**
 * Gửi yêu cầu đăng ký đến server.
 * @param {object} userData - Dữ liệu người dùng (vd: {name, email, password})
 * @returns {Promise}
 */
const registerWithApi = (userData) => {
  return apiClient.post('/auth/register', userData);
};


// =================================================================
// HÀM GIẢ LẬP API (Dùng để test khi backend chưa sẵn sàng)
// Giữ lại để tham khảo hoặc bật lại khi cần
// =================================================================

const loginWithMockData = (email, password) => {
  console.log(`[MOCK API] Gửi yêu cầu đăng nhập đến ${apiClient.defaults.baseURL}/auth/login với email: ${email}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email.toLowerCase().includes('student')) {
        resolve({
          data: {
            token: 'fake-jwt-token-for-student',
            user: { name: 'Sinh Viên A', email: email, role: 'student' },
          },
        });
      } else if (email.toLowerCase().includes('employer')) {
        resolve({
          data: {
            token: 'fake-jwt-token-for-employer',
            user: { name: 'Công Ty B', email: email, role: 'employer' },
          },
        });
      } else {
        reject(new Error('Email hoặc mật khẩu không hợp lệ (phản hồi giả)'));
      }
    }, 1000);
  });
};


// =================================================================
// EXPORT CÁC HÀM ĐỂ SỬ DỤNG
// Đây là nơi quyết định sẽ dùng hàm thật hay hàm giả
// =================================================================

const authService = {
  // Khi có backend, chúng ta sẽ dùng hàm này.
  // login: loginWithApi,
  register: registerWithApi,

  // Khi backend chưa có hoặc cần test giao diện độc lập,
  // hãy comment dòng trên và bỏ comment dòng dưới.
  login: loginWithMockData, 
};

export default authService;