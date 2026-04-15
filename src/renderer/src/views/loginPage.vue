<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">用户登录</h2>
      

      
      <!-- 用户名输入 -->
      <div class="input-group">
        <div class="input-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <input 
          type="text" 
          v-model="username" 
          placeholder="请输入用户名" 
          class="input-field"
          :class="{ 'input-error': errors.username }"
        >
        <div v-if="errors.username" class="error-message">{{ errors.username }}</div>
      </div>
      
      <!-- 密码输入 -->
      <div class="input-group">
        <div class="input-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <input 
          type="password" 
          v-model="password" 
          placeholder="请输入密码" 
          class="input-field"
          :class="{ 'input-error': errors.password }"
        >
        <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
      </div>
      
      <!-- 登录错误提示 -->
      <div v-if="errors.login" class="login-error">{{ errors.login }}</div>
      
      <!-- 登录按钮 -->
      <button 
        @click="handleLogin" 
        class="login-button"
      >
        登录
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { username, password, errors, handleLogin } from '../stores/authStore'
</script>

<style scoped lang="less">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #0a1929 0%, #1a2a40 100%);
  position: relative;
  overflow: hidden;
  
  // 科技感背景元素
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(0, 229, 255, 0.1) 0%, transparent 30%),
      radial-gradient(circle at 80% 70%, rgba(0, 229, 255, 0.05) 0%, transparent 40%),
      linear-gradient(90deg, transparent 0%, rgba(0, 229, 255, 0.03) 50%, transparent 100%);
    z-index: 0;
  }
  
  // 网格线效果
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(rgba(0, 229, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 229, 255, 0.05) 1px, transparent 1px);
    background-size: 30px 30px;
    z-index: 0;
  }
}

.login-box {
  width: 420px;
  padding: 45px;
  background: rgba(10, 25, 41, 0.9);
  border-radius: 16px;
  box-shadow: 
    0 0 40px rgba(0, 229, 255, 0.2),
    inset 0 0 0 1px rgba(0, 229, 255, 0.1);
  border: 1px solid rgba(0, 229, 255, 0.2);
  position: relative;
  z-index: 1;
  overflow: hidden;
  
  // 异形设计元素 - 左上角装饰
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, rgba(0, 229, 255, 0.1) 0%, transparent 100%);
    border-radius: 16px 0 100px 0;
    z-index: 0;
  }
  
  // 异形设计元素 - 右下角装饰
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 150px;
    height: 150px;
    background: linear-gradient(45deg, transparent 0%, rgba(0, 229, 255, 0.05) 100%);
    border-radius: 100px 0 16px 0;
    z-index: 0;
  }
}

.login-title {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 35px;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #00e5ff 0%, #00bfff 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
  position: relative;
  z-index: 1;
}

.input-group {
  position: relative;
  margin-bottom: 25px;
  position: relative;
  z-index: 1;
  
  .input-icon {
    position: absolute;
    left: 15px;
    top: 14px;
    color: #00e5ff;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .input-field {
    width: 100%;
    padding: 14px 15px 14px 45px;
    border: 1px solid rgba(0, 229, 255, 0.3);
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.05);
    color: #00e5ff;
    
    &::placeholder {
      color: rgba(0, 229, 255, 0.5);
    }
    
    &:focus {
      outline: none;
      border-color: #00e5ff;
      box-shadow: 0 0 0 3px rgba(0, 229, 255, 0.2);
      background: rgba(255, 255, 255, 0.08);
    }
  }
  
  .error-message {
    color: #ff4d4f;
    font-size: 12px;
    margin-top: 5px;
    margin-left: 45px;
  }
}

.login-button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #00e5ff 0%, #0080ff 100%);
  color: #0a1929;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 25px;
  position: relative;
  z-index: 1;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(0, 229, 255, 0.5);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
}

.input-error {
  border-color: #ff4d4f !important;
  box-shadow: 0 0 0 3px rgba(255, 77, 79, 0.2) !important;
}

.login-error {
  color: #ff4d4f;
  font-size: 14px;
  text-align: center;
  margin: 15px 0;
  padding: 10px;
  background-color: rgba(255, 77, 79, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(255, 77, 79, 0.3);
  position: relative;
  z-index: 1;
}
</style>
