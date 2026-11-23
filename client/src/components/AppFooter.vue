<script setup lang="ts">
/* ============================================================
 * AppFooter —— 全站公共页脚
 *  - 备案信息：ICP 备案 + 公安备案（点击跳转工信部）
 *  - 联系方式：B站 / 抖音 / 小红书（点击跳转作者主页）
 * 挂载位置：App.vue，所有页面底部统一显示
 * ============================================================ */

import { siteConfig, resolveTemplate } from '@/config'
import { ICON_BILIBILI, ICON_DOUYIN, ICON_XHS } from './icons'

type Social = { name: string; url: string; icon: string }

const SOCIAL_ICONS: Record<string, string> = {
  bilibili: ICON_BILIBILI,
  douyin: ICON_DOUYIN,
  xhs: ICON_XHS,
}

/* 联系方式来自 @/config 的 siteConfig.footer.socials，增删改只改配置 */
const socials: Social[] = siteConfig.footer.socials.map((social) => ({
  name: social.platform,
  url: social.url,
  icon: SOCIAL_ICONS[social.platform] ?? '',
}))
</script>

<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <!-- 联系方式 -->
      <div class="footer-row social-row">
        <span class="row-label">{{ siteConfig.footer.contactLabel }}</span>
        <a
          v-for="s in socials"
          :key="s.name"
          :href="s.url"
          target="_blank"
          rel="noopener noreferrer"
          class="social-item"
          :title="s.name"
        >
          <span class="social-icon" v-html="s.icon"></span>
          <span class="social-name">{{ s.name }}</span>
        </a>
      </div>

      <!-- 备案信息 -->
      <div class="footer-row filing-row">
        <span>{{ resolveTemplate(siteConfig.footer.copyright) }}</span>
        <a
          v-if="siteConfig.footer.icp"
          :href="siteConfig.footer.icpUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="filing-link"
        >{{ siteConfig.footer.icp }}</a>
        <!-- <a
          href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11000000000000"
          target="_blank"
          rel="noopener noreferrer"
          class="filing-link"
        >
          <span class="ga-badge">京</span>
          京公网安备 11000002000000 号
        </a> -->
      </div>

      <div class="footer-row tagline-row">
        <span>{{ siteConfig.identity.tagline }}</span>
        <span class="dot">·</span>
        <span>{{ siteConfig.footer.motto }}</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  width: 100%;
  background: linear-gradient(180deg, #fbfdff, #f4f8ff);
  border-top: 1px solid #edf1f5;
  padding: 24px 20px 28px;
  font-size: 12px;
  color: #8492a9;
  text-align: center;
}
.footer-inner {
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.footer-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}

/* 联系方式行 */
.social-row {
  gap: 12px;
}
.row-label {
  letter-spacing: 0.2em;
  color: #74809a;
  margin-right: 4px;
}
.social-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(219, 228, 239, 0.8);
  text-decoration: none;
  color: #445675;
  transition: all 0.2s ease;
}
.social-item:hover {
  transform: translateY(-1px);
  border-color: #2d68ef;
  box-shadow: 0 4px 10px rgba(45, 104, 239, 0.12);
}
.social-item:nth-child(2) .social-icon { color: #fb7299; }   /* B站 粉 */
.social-item:nth-child(3) .social-icon { color: #000; }       /* 抖音 黑 */
.social-item:nth-child(4) .social-icon { color: #ff2741; }   /* 小红书 红 */
.social-icon {
  display: inline-flex;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
}

/* 备案信息行 */
.filing-row {
  gap: 16px;
  color: #9aa6bd;
}
.filing-link {
  color: #9aa6bd;
  text-decoration: none;
  transition: color 0.15s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.filing-link:hover {
  color: #2d68ef;
}
.ga-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 3px;
  background: #2d68ef;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
}

/* 标语行 */
.tagline-row {
  color: #b4bdce;
  font-size: 11px;
}
.dot {
  color: #cfd6e4;
}
</style>
