"use client";
import { supabase } from "../../lib/supabase";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";


const CAT_ICONS: Record<string, string> = {
  "Dairy, Bread & Eggs":"🥛","Fruits & Vegetables":"🥦","Snacks & Munchies":"🍿",
  "Breakfast & Instant Food":"🥣","Sweet Tooth":"🍫","Bakery & Biscuits":"🍪",
  "Tea, Coffee & Milk Drinks":"☕","Atta, Rice & Dal":"🌾","Masala, Oil & More":"🫙",
  "Sauces & Spreads":"🥫","Cold Drinks & Juices":"🥤","Chicken, Meat & Fish":"🍗",
  "Baby Care":"🍼","Pharma & Wellness":"💊","Cleaning Essentials":"🧹",
  "Home & Office":"🏠","Personal Care":"🪥","Pet Care":"🐾",
  "Paan Corner":"🌿","Organic & Healthy Living":"🥗","Other":"🛍️",
};

const MINI_BANNERS = [
  { bg:"linear-gradient(135deg,#00875A,#00C27A)", emoji:"🥦", tag:"Fresh Today", title:"Farm Fresh Veggies", sub:"Straight from local farms", cat:"Fruits & Vegetables" },
  { bg:"linear-gradient(135deg,#B45309,#F59E0B)", emoji:"🍫", tag:"Sweet deals", title:"Chocolates & Snacks", sub:"Best brands, best prices", cat:"Sweet Tooth" },
  { bg:"linear-gradient(135deg,#1255CC,#1A6BFF)", emoji:"💊", tag:"Health first", title:"Pharma & Wellness", sub:"Medicines at your door", cat:"Pharma & Wellness" },
  { bg:"linear-gradient(135deg,#7C3AED,#A855F7)", emoji:"🧴", tag:"Self care", title:"Personal Care", sub:"Top brands delivered fast", cat:"Personal Care" },
  { bg:"linear-gradient(135deg,#DC2626,#F97316)", emoji:"🍗", tag:"Non veg", title:"Meat & Fish Fresh", sub:"Cleaned & packed daily", cat:"Chicken, Meat & Fish" },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F4F6FB; }
.page { min-height: 100vh; background: #F4F6FB; font-family: 'Plus Jakarta Sans', sans-serif; }

/* HEADER */
.top-bar { background: #1A6BFF; padding: 12px 16px 14px; position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 20px rgba(26,107,255,0.3); }
.top-bar-row1 { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.brand { font-size: 22px; font-weight: 900; color: white; letter-spacing: -1px; }
.cart-fab { display: flex; align-items: center; gap: 6px; background: white; color: #1A6BFF; padding: 8px 14px; border-radius: 12px; font-size: 13px; font-weight: 800; text-decoration: none; position: relative; }
.cart-badge { background: #FF6B2B; color: white; font-size: 10px; font-weight: 800; width: 17px; height: 17px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.logout-btn { display: flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.18); border: 1.5px solid rgba(255,255,255,0.25); color: rgba(255,255,255,0.85); padding: 7px 12px; border-radius: 10px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
.logout-btn:hover { background: rgba(255,0,0,0.2); color: white; }
.profile-overlay { position: fixed; inset: 0; background: rgba(13,27,62,0.55); z-index: 500; display: flex; align-items: flex-end; justify-content: center; backdrop-filter: blur(4px); }
.profile-sheet { background: white; border-radius: 24px 24px 0 0; width: 100%; max-width: 480px; max-height: 92vh; overflow-y: auto; animation: slideUp 0.3s ease; }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.profile-handle { width: 40px; height: 4px; background: #E4EAFF; border-radius: 2px; margin: 14px auto 0; }
.profile-avatar { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #1A6BFF, #6B35FF); display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 16px auto 8px; }
.profile-name-big { font-size: 20px; font-weight: 900; color: #0D1B3E; text-align: center; }
.profile-phone-big { font-size: 13px; color: #8A96B5; font-weight: 600; text-align: center; margin-top: 4px; margin-bottom: 16px; }
.profile-section { padding: 16px 20px; border-top: 1.5px solid #F4F6FB; }
.profile-section-title { font-size: 12px; font-weight: 800; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 12px; }
.profile-field { margin-bottom: 12px; }
.pf-label { font-size: 11px; font-weight: 700; color: #B0BACC; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
.pf-input { width: 100%; padding: 12px 14px; border: 1.5px solid #E4EAFF; border-radius: 12px; font-size: 14px; font-weight: 600; color: #0D1B3E; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
.pf-input:focus { border-color: #1A6BFF; }
.pf-input:read-only { background: #F4F6FB; color: #8A96B5; }
.save-profile-btn { width: 100%; padding: 14px; background: #1A6BFF; color: white; border: none; border-radius: 14px; font-size: 15px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
.save-profile-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.addr-map-btn { display: flex; align-items: center; gap: 8px; width: 100%; padding: 12px 14px; border: 1.5px solid #E4EAFF; border-radius: 12px; background: #F4F6FB; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
.addr-map-btn:hover { border-color: #1A6BFF; background: #EBF1FF; }
.profile-btn { width: 36px; height: 36px; background: rgba(255,255,255,0.18); border: 1.5px solid rgba(255,255,255,0.25); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer; color: white; }
.search-bar { display: flex; align-items: center; gap: 10px; background: white; border-radius: 12px; padding: 10px 14px; }
.search-bar input { border: none; outline: none; font-size: 14px; font-weight: 500; color: #0D1B3E; background: transparent; width: 100%; font-family: 'Plus Jakarta Sans', sans-serif; }
.search-bar input::placeholder { color: #B0BACC; }

/* SORT BAR */
.sort-bar { display: flex; gap: 8px; padding: 8px 14px; overflow-x: auto; background: white; border-bottom: 1.5px solid #E4EAFF; }
.sort-bar::-webkit-scrollbar { display: none; }
.sort-chip { display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; border-radius: 20px; border: 1.5px solid #E4EAFF; background: white; font-size: 12px; font-weight: 700; color: #4A5880; cursor: pointer; white-space: nowrap; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; flex-shrink: 0; }
.sort-chip.active { background: #1A6BFF; color: white; border-color: #1A6BFF; }

/* MAIN LAYOUT: sidebar + content */
.main-layout { display: flex; height: calc(100vh - 130px); overflow: hidden; }

/* LEFT SIDEBAR */
.sidebar { width: 82px; flex-shrink: 0; background: white; border-right: 1.5px solid #E4EAFF; overflow-y: auto; overflow-x: hidden; }
.sidebar::-webkit-scrollbar { display: none; }
.sidebar-item { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 12px 4px; cursor: pointer; border-left: 3px solid transparent; transition: all 0.15s; position: relative; }
.sidebar-item.active { border-left-color: #1A6BFF; background: #EBF1FF; }
.sidebar-item.active::after { content: ''; position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 0; height: 0; border-top: 6px solid transparent; border-bottom: 6px solid transparent; border-right: 6px solid #F4F6FB; }
.sidebar-img { width: 44px; height: 44px; border-radius: 10px; overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: 22px; background: #F4F6FB; }
.sidebar-item.active .sidebar-img { background: #DDEAFF; }
.sidebar-img img { width: 100%; height: 100%; object-fit: contain; }
.sidebar-label { font-size: 9.5px; font-weight: 700; color: #8A96B5; text-align: center; line-height: 1.2; max-width: 72px; white-space: pre-line; }
.sidebar-item.active .sidebar-label { color: #1A6BFF; }
.sidebar-dot { width: 5px; height: 5px; background: #1A6BFF; border-radius: 50%; position: absolute; right: 6px; top: 10px; display: none; }
.sidebar-item.active .sidebar-dot { display: block; }

/* RIGHT CONTENT */
.content-area { flex: 1; overflow-y: auto; overflow-x: hidden; background: #F4F6FB; }
.content-area::-webkit-scrollbar { display: none; }

/* HERO */
.hero { margin: 12px 14px; border-radius: 18px; background: linear-gradient(120deg, #0B1F5C 0%, #1A6BFF 60%, #4D8FFF 100%); padding: 22px 20px; display: flex; align-items: center; justify-content: space-between; min-height: 130px; position: relative; overflow: hidden; }
.hero::before { content: ''; position: absolute; right: -30px; top: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.05); border-radius: 50%; }
.hero-text { flex: 1; z-index: 1; }
.hero-tag { display: inline-block; background: rgba(255,255,255,0.18); color: white; font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 20px; margin-bottom: 7px; letter-spacing: 0.8px; text-transform: uppercase; }
.hero-title { font-size: 20px; font-weight: 900; color: white; line-height: 1.15; letter-spacing: -0.5px; margin-bottom: 5px; }
.hero-sub { font-size: 11px; color: rgba(255,255,255,0.72); font-weight: 500; margin-bottom: 14px; line-height: 1.5; }
.hero-btn { display: inline-block; background: white; color: #1A6BFF; padding: 8px 18px; border-radius: 10px; font-size: 13px; font-weight: 800; border: none; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; }
.hero-icon { font-size: 64px; z-index: 1; flex-shrink: 0; margin-left: 10px; }

/* MINI BANNERS */
.mini-section { padding: 4px 14px 0; }
.mini-section-title { font-size: 15px; font-weight: 800; color: #0D1B3E; margin-bottom: 10px; }
.mini-banners { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 2px; }
.mini-banners::-webkit-scrollbar { display: none; }
.mini-banner { flex-shrink: 0; width: 145px; border-radius: 14px; padding: 13px 11px; display: flex; flex-direction: column; min-height: 105px; position: relative; overflow: hidden; cursor: pointer; transition: transform 0.15s; }
.mini-banner:active { transform: scale(0.97); }
.mini-banner-emoji { position: absolute; right: 6px; bottom: 6px; font-size: 36px; opacity: 0.85; }
.mini-banner-tag { font-size: 9px; font-weight: 800; color: rgba(255,255,255,0.75); text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 4px; }
.mini-banner-title { font-size: 12px; font-weight: 900; color: white; line-height: 1.25; margin-bottom: 3px; }
.mini-banner-sub { font-size: 9px; color: rgba(255,255,255,0.65); line-height: 1.3; margin-bottom: 8px; flex: 1; }
.mini-banner-btn { display: inline-block; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.35); color: white; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 7px; width: fit-content; }

/* CATEGORY SECTION HEADER */
.cat-section-hdr { padding: 16px 14px 10px; display: flex; align-items: center; justify-content: space-between; }
.cat-section-title { font-size: 16px; font-weight: 800; color: #0D1B3E; display: flex; align-items: center; gap: 7px; }
.cat-section-count { font-size: 11px; color: #8A96B5; font-weight: 600; background: white; border: 1.5px solid #E4EAFF; padding: 3px 9px; border-radius: 20px; }

/* PRODUCTS GRID inside category */
.cat-products-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0 14px 20px; }

/* PRODUCT CARD */
.product-card { background: white; border-radius: 14px; overflow: hidden; border: 1.5px solid #E4EAFF; box-shadow: 0 2px 8px rgba(26,107,255,0.06); transition: all 0.2s; }
.product-img-wrap { height: 130px; background: linear-gradient(135deg, #EBF1FF, #DDEAFF); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.product-img { width: 100%; height: 100%; object-fit: cover; }
.product-img-placeholder { font-size: 48px; }
.low-stock-badge { position: absolute; top: 7px; left: 7px; background: #FF6B2B; color: white; font-size: 9px; font-weight: 800; padding: 2px 7px; border-radius: 6px; }
.out-of-stock-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.78); display: flex; align-items: center; justify-content: center; }
.out-of-stock-badge { background: white; border: 1.5px solid #E4EAFF; color: #8A96B5; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 8px; }
.product-info { padding: 10px 10px 12px; }
.product-name { font-size: 13px; font-weight: 700; color: #0D1B3E; line-height: 1.3; margin-bottom: 2px; }
.product-size-tag { font-size: 11px; color: #B0BACC; font-weight: 600; margin-bottom: 3px; }
.product-shop-tag { font-size: 10px; color: #8A96B5; font-weight: 600; margin-bottom: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.product-footer { display: flex; align-items: center; justify-content: space-between; }
.product-price { font-size: 15px; font-weight: 900; color: #0D1B3E; }
.add-btn { width: 32px; height: 32px; background: #1A6BFF; border: none; border-radius: 8px; color: white; font-size: 22px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-weight: 300; line-height: 1; transition: all 0.15s; }
.add-btn:hover { background: #1255CC; transform: scale(1.08); }
.add-btn:disabled { background: #E4EAFF; color: #B0BACC; cursor: not-allowed; transform: none; }
.qty-ctrl { display: flex; align-items: center; background: #EBF1FF; border-radius: 8px; overflow: hidden; }
.qty-btn { width: 28px; height: 32px; background: #1A6BFF; border: none; color: white; font-size: 16px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.qty-btn:hover { background: #1255CC; }
.qty-num { width: 26px; text-align: center; font-size: 13px; font-weight: 800; color: #0D1B3E; }

/* SEARCH RESULTS GRID */
.search-results { padding: 12px 14px; }
.search-label { font-size: 13px; color: #8A96B5; font-weight: 700; margin-bottom: 12px; }
.search-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

/* FILTER SHEET */
.filter-sheet-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 200; }
.filter-sheet { position: fixed; bottom: 0; left: 0; right: 0; background: white; border-radius: 22px 22px 0 0; padding: 20px; z-index: 201; max-height: 85vh; overflow-y: auto; }
.sheet-handle { width: 36px; height: 4px; background: #E4EAFF; border-radius: 2px; margin: 0 auto 20px; }
.sheet-title { font-size: 16px; font-weight: 800; color: #0D1B3E; margin-bottom: 16px; }
.sheet-section { margin-bottom: 20px; }
.sheet-label { font-size: 11px; font-weight: 800; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 10px; }
.sheet-options { display: flex; flex-wrap: wrap; gap: 8px; }
.sheet-opt { padding: 8px 14px; border-radius: 20px; border: 1.5px solid #E4EAFF; background: white; font-size: 13px; font-weight: 700; color: #4A5880; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
.sheet-opt.active { background: #EBF1FF; color: #1A6BFF; border-color: #1A6BFF; }
.price-range { display: flex; align-items: center; gap: 10px; }
.price-input { flex: 1; padding: 10px 12px; border: 2px solid #E4EAFF; border-radius: 10px; font-size: 14px; font-weight: 600; color: #0D1B3E; background: #F4F6FB; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; }
.price-input:focus { border-color: #1A6BFF; background: white; }
.sheet-actions { display: flex; gap: 10px; margin-top: 4px; }
.btn-clear { flex: 1; padding: 13px; background: #F4F6FB; color: #4A5880; border: none; border-radius: 12px; font-size: 14px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }
.btn-apply { flex: 2; padding: 13px; background: #1A6BFF; color: white; border: none; border-radius: 12px; font-size: 14px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }

/* CART FLOAT */
.cart-float { position: fixed; bottom: 78px; left: 16px; right: 16px; background: #0D1B3E; color: white; border-radius: 14px; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; box-shadow: 0 8px 30px rgba(13,27,62,0.4); z-index: 50; text-decoration: none; font-family: 'Plus Jakarta Sans', sans-serif; transition: transform 0.2s; }
.cart-float:hover { transform: translateY(-2px); }
.cart-float-left { font-size: 12px; color: rgba(255,255,255,0.7); font-weight: 500; }
.cart-float-left strong { color: white; font-size: 14px; display: block; font-weight: 800; }
.cart-float-right { font-size: 14px; font-weight: 800; color: #60A5FF; }

/* BOTTOM NAV */
.bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; height: 68px; background: white; border-top: 1.5px solid #E4EAFF; display: flex; align-items: center; box-shadow: 0 -4px 20px rgba(26,107,255,0.07); z-index: 100; }
.nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 8px 0; text-decoration: none; color: #B0BACC; font-size: 10px; font-weight: 700; transition: color 0.15s; }
.nav-item.active { color: #1A6BFF; }
.shop-search-bar { display: flex; align-items: center; gap: 10px; background: white; border-radius: 14px; padding: 12px 16px; margin: 12px 14px 0; border: 1.5px solid #E4EAFF; box-shadow: 0 2px 8px rgba(26,107,255,0.06); }
.shop-search-bar input { border: none; outline: none; font-size: 14px; font-weight: 500; color: #0D1B3E; background: transparent; width: 100%; font-family: 'Plus Jakarta Sans', sans-serif; }
.shop-search-bar input::placeholder { color: #B0BACC; }
.shop-selector-overlay { position: fixed; inset: 0; background: rgba(13,27,62,0.55); z-index: 600; display: flex; align-items: flex-end; justify-content: center; backdrop-filter: blur(4px); }
.shop-selector-sheet { background: white; border-radius: 24px 24px 0 0; width: 100%; max-width: 480px; padding: 0 0 48px; animation: slideUp 0.3s ease; }
.shop-selector-handle { width: 40px; height: 4px; background: #E4EAFF; border-radius: 2px; margin: 16px auto 14px; }
.shop-selector-title { font-size: 16px; font-weight: 900; color: #0D1B3E; padding: 0 20px 14px; border-bottom: 1.5px solid #F4F6FB; }
.shop-selector-sub { font-size: 12px; color: #8A96B5; font-weight: 500; margin-top: 3px; }
.shop-option { display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-bottom: 1px solid #F4F6FB; cursor: pointer; transition: background 0.15s; }
.shop-option:hover { background: #F4F6FB; }
.shop-option:last-child { border-bottom: none; }
.shop-option-icon { width: 42px; height: 42px; background: #EBF1FF; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.shop-option-name { font-size: 15px; font-weight: 800; color: #0D1B3E; }
.shop-option-meta { font-size: 12px; color: #8A96B5; font-weight: 500; margin-top: 2px; }
.shop-option-price { font-size: 16px; font-weight: 900; color: #1A6BFF; margin-left: auto; flex-shrink: 0; }
.cart-locked-banner { background: #FFF8E6; border-bottom: 1.5px solid #FFB800; padding: 8px 16px; display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: #946200; }
.clear-cart-btn { margin-left: auto; background: none; border: none; color: #E53E3E; font-size: 12px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; text-decoration: underline; }
.multi-shop-badge { position: absolute; top: 6px; right: 6px; background: #1A6BFF; color: white; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 5px; z-index: 2; }
.nav-icon { font-size: 20px; line-height: 1; }
.ad-hero-banner { margin: 12px 14px 0; border-radius: 18px; padding: 20px; display: flex; align-items: center; justify-content: space-between; min-height: 120px; position: relative; overflow: hidden; cursor: pointer; transition: background 0.5s; }
.banner-dots { display: flex; justify-content: center; gap: 5px; margin: 8px 14px 0; }
.banner-dot { width: 6px; height: 6px; border-radius: 50%; background: #D0D8EF; transition: all 0.3s; cursor: pointer; border: none; padding: 0; }
.banner-dot.active { background: #1A6BFF; width: 18px; border-radius: 3px; }
.ad-hero-banner::before { content: ''; position: absolute; right: -20px; top: -20px; width: 150px; height: 150px; background: rgba(255,255,255,0.08); border-radius: 50%; }
.ad-sponsored-chip { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.35); color: rgba(255,255,255,0.85); font-size: 9px; font-weight: 800; padding: 3px 7px; border-radius: 5px; letter-spacing: 0.5px; text-transform: uppercase; }
.ad-featured-row { display: flex; gap: 8px; overflow-x: auto; padding: 0 14px; margin-top: 10px; scrollbar-width: none; }
.ad-featured-row::-webkit-scrollbar { display: none; }
.ad-featured-card { flex-shrink: 0; background: linear-gradient(135deg, #1A6BFF, #4D8FFF); border-radius: 14px; padding: 12px 14px; min-width: 160px; cursor: pointer; position: relative; }
.ad-featured-label { font-size: 9px; font-weight: 800; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 4px; }
.ad-featured-name { font-size: 14px; font-weight: 900; color: white; margin-bottom: 4px; line-height: 1.2; }
.ad-featured-cta { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.18); padding: 4px 10px; border-radius: 6px; display: inline-block; margin-top: 4px; }
.ad-featured-emoji { position: absolute; right: 10px; bottom: 8px; font-size: 28px; opacity: 0.8; }
.sponsored-product-badge { position: absolute; top: 6px; left: 6px; background: #FFB800; color: #0D1B3E; font-size: 8px; font-weight: 800; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.3px; z-index: 2; }

/* VIEW TOGGLE */
.view-toggle { display: flex; background: #F4F6FB; border-radius: 14px; padding: 4px; margin: 12px 14px 0; border: 1.5px solid #E4EAFF; }
.view-btn { flex: 1; padding: 10px; border: none; border-radius: 11px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; background: transparent; color: #8A96B5; transition: all 0.2s; }
.view-btn.active { background: #1A6BFF; color: white; box-shadow: 0 3px 10px rgba(26,107,255,0.3); }

/* SHOPS LIST */
.shops-list { padding: 12px 14px 100px; display: flex; flex-direction: column; gap: 0; }
.shops-count { font-size: 12px; color: #8A96B5; font-weight: 700; margin-bottom: 12px; }
.shop-card { background: white; border-radius: 20px; overflow: hidden; margin-bottom: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); cursor: pointer; transition: transform 0.2s; }
.shop-card:active { transform: scale(0.98); }
.shop-cover { width: 100%; height: 180px; object-fit: cover; display: block; }
.shop-cover-placeholder { width: 100%; height: 180px; background: linear-gradient(135deg,#1A6BFF,#4D8FFF); display: flex; align-items: center; justify-content: center; font-size: 64px; }
.shop-card-body { padding: 14px 16px 16px; }
.shop-card-row1 { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 6px; }
.shop-card-name { font-size: 19px; font-weight: 900; color: #0D1B3E; }
.shop-rating { display: flex; align-items: center; gap: 4px; background: #1A6BFF; color: white; font-size: 12px; font-weight: 800; padding: 4px 9px; border-radius: 8px; flex-shrink: 0; }
.shop-card-meta { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #4A5880; font-weight: 600; margin-bottom: 10px; flex-wrap: wrap; }
.shop-meta-dot { color: #D0D8EF; }
.shop-card-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.shop-tag { display: inline-flex; align-items: center; gap: 4px; background: #EBF1FF; color: #1A6BFF; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; }
.shop-tag.green { background: #E6FAF4; color: #00875A; }
.shop-tag.orange { background: #FFF8E6; color: #946200; }
.no-shops { text-align: center; padding: 60px 24px; }

/* SHOP DETAIL */
.shop-detail-header { background: #1A6BFF; padding: 14px 16px; position: sticky; top: 0; z-index: 200; display: flex; align-items: center; gap: 12px; box-shadow: 0 4px 20px rgba(26,107,255,0.3); }
.shop-detail-back-btn { width: 36px; height: 36px; background: rgba(255,255,255,0.2); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; color: white; cursor: pointer; border: none; flex-shrink: 0; }
.shop-detail-title { font-size: 17px; font-weight: 900; color: white; }
.shop-detail-sub { font-size: 11px; color: rgba(255,255,255,0.75); font-weight: 600; margin-top: 2px; }
.shop-hero-img { width: 100%; height: 200px; object-fit: cover; display: block; }
.shop-info-bar { background: white; padding: 12px 16px; display: flex; gap: 0; border-bottom: 1.5px solid #F4F6FB; overflow-x: auto; }
.shop-info-stat { display: flex; align-items: center; gap: 5px; font-size: 13px; font-weight: 700; color: #4A5880; padding-right: 16px; margin-right: 16px; border-right: 1.5px solid #E4EAFF; white-space: nowrap; }
.shop-info-stat:last-child { border-right: none; }
.shop-products-area { padding: 14px 14px 120px; }
.shop-cat-title { font-size: 15px; font-weight: 900; color: #0D1B3E; margin: 16px 0 10px; display: flex; align-items: center; gap: 7px; }
.shop-cat-title:first-child { margin-top: 0; }

/* SKELETON */
.skeleton { background: linear-gradient(90deg,#f0f4ff 25%,#e4eaff 50%,#f0f4ff 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 10px; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.empty-state { text-align: center; padding: 60px 24px; }
.empty-icon { font-size: 56px; margin-bottom: 12px; }
.empty-title { font-size: 18px; font-weight: 800; color: #0D1B3E; margin-bottom: 6px; }
.empty-sub { font-size: 14px; color: #8A96B5; }

/* HOME TAB in sidebar */
.sidebar-home { background: #1A6BFF; }
.sidebar-home .sidebar-label { color: white; }
`;

function distance(la1:number,lo1:number,la2:number,lo2:number){
  const R=6371,dLa=(la2-la1)*Math.PI/180,dLo=(lo2-lo1)*Math.PI/180;
  const a=Math.sin(dLa/2)**2+Math.cos(la1*Math.PI/180)*Math.cos(la2*Math.PI/180)*Math.sin(dLo/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

export default function CustomerDashboard() {
  return (
    <Suspense fallback={<div style={{padding:40,textAlign:"center",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#8A96B5"}}>Loading...</div>}>
      <CustomerDashboardInner />
    </Suspense>
  );
}

function CustomerDashboardInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // Show restriction screen immediately if redirected from checkout with ?restricted=1
  const [tempBanned, setTempBanned] = useState(searchParams.get("restricted") === "1");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("distance");
  const [activeTab, setActiveTab] = useState("home"); // "home" or category name
  const [showFilter, setShowFilter] = useState(false);
  const [fMinPrice, setFMinPrice] = useState("");
  const [fMaxPrice, setFMaxPrice] = useState("");
  const [fShop, setFShop] = useState("");
  const [fBrand, setFBrand] = useState("");
  const [fInStock, setFInStock] = useState(true);
  const [fOrderType, setFOrderType] = useState<"pickup"|"delivery"|"both">("both");
  const [applied, setApplied] = useState<{minPrice:string,maxPrice:string,shop:string,brand:string,inStock:boolean,orderType:string}>({ minPrice:"", maxPrice:"", shop:"", brand:"", inStock:true, orderType:"both" });
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollSaveRef = useRef<number>(0); // saves scroll position before silent refresh
  const [viewMode, setViewMode] = useState<"products"|"shops">("products");
  const [showProfile, setShowProfile] = useState(false);
  const [shopSelectorProduct, setShopSelectorProduct] = useState<any>(null);
  const [masterSearchResults, setMasterSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [allMasterProducts, setAllMasterProducts] = useState<any[]>([]);
  const [allMasterLoading, setAllMasterLoading] = useState(false);
  const [cartShopId, setCartShopId] = useState<string>("");
  const [profileData, setProfileData] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editLat, setEditLat] = useState<number|null>(null);
  const [editLng, setEditLng] = useState<number|null>(null);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [deletingAddrId, setDeletingAddrId] = useState<string|null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [searchShops, setSearchShops] = useState("");
  const [nearbyShops, setNearbyShops] = useState<any[]>([]);
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [shopProducts, setShopProducts] = useState<any[]>([]);
  const [shopLoading, setShopLoading] = useState(false);
  const [userLat, setUserLat] = useState<number|null>(null);
  const [userLng, setUserLng] = useState<number|null>(null);
  const [heroBannerAds, setHeroBannerAds] = useState<any[]>([]);
  const [heroBannerIndex, setHeroBannerIndex] = useState(0);
  const [featuredShops, setFeaturedShops] = useState<any[]>([]);
  const [sponsoredProducts, setSponsoredProducts] = useState<any[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [looseAmounts, setLooseAmounts] = useState<Record<string,string>>({}); // productKey -> ₹ amount
  const [bookmarkIds, setBookmarkIds] = useState<Set<string>>(new Set());
  const [notifCount, setNotifCount] = useState(0);
  const [sponsoredProductIds, setSponsoredProductIds] = useState<Set<string>>(new Set());
  // Refs mirror state so applyFilters always gets current values (no stale closure)
  const sponsoredProductsRef = useRef<any[]>([]);
  const sponsoredProductIdsRef = useRef<Set<string>>(new Set());
  const rawProductsRef = useRef<any[]>([]); // unmodified products for re-processing
  const allProductsRef = useRef<any[]>([]); // all live shop products, no distance cap — for search
  const looseProductsRef = useRef<any[]>([]); // loose products always available for search

  useEffect(() => {
    const saved = localStorage.getItem("bubbry_cart");
    if (saved) {
      const parsed = JSON.parse(saved);
      setCart(parsed);
      if (parsed.length > 0 && parsed[0].shop_id) setCartShopId(parsed[0].shop_id);
    }
    fetchCategories();
    loadUserData();
    let userLat: number|undefined, userLng: number|undefined;

    // Priority 1: Use saved delivery address location (most accurate for the customer)
    const savedDeliveryLat = parseFloat(localStorage.getItem("bubbry_delivery_lat") || "");
    const savedDeliveryLng = parseFloat(localStorage.getItem("bubbry_delivery_lng") || "");

    if (savedDeliveryLat && savedDeliveryLng && !isNaN(savedDeliveryLat) && !isNaN(savedDeliveryLng)) {
      // Use delivery address as the reference point
      userLat = savedDeliveryLat;
      userLng = savedDeliveryLng;
      setUserLat(userLat);
      setUserLng(userLng);
      fetchProducts(userLat, userLng);
      fetchShops(userLat, userLng);
      fetchAds(userLat, userLng);
      // Also watch GPS in background in case delivery address changes
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            // Only update if no delivery address was set (fallback)
            const stillSaved = localStorage.getItem("bubbry_delivery_lat");
            if (!stillSaved) {
              userLat = pos.coords.latitude; userLng = pos.coords.longitude;
              setUserLat(userLat); setUserLng(userLng);
            }
          },
          () => {}
        );
      }
    } else if (navigator.geolocation) {
      // Priority 2: Use device GPS if no delivery address saved
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          userLat = pos.coords.latitude; userLng = pos.coords.longitude;
          setUserLat(userLat); setUserLng(userLng);
          fetchProducts(userLat, userLng);
          fetchShops(userLat, userLng);
          fetchAds(userLat, userLng);
        },
        () => { fetchProducts(); fetchShops(); fetchAds(); }
      );
    } else {
      fetchProducts(); fetchShops(); fetchAds();
    }

    // Realtime — refresh products/shops when inventory or profiles change
    const rt1 = supabase.channel("dash-products-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "shop_products" }, () => {
        fetchProducts(userLat, userLng, true); // silent refresh
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles" }, () => {
        fetchShops(userLat, userLng);
      })
      .subscribe();

    // Silent poll every 15s — updates products without scroll reset
    const poll = setInterval(() => {
      fetchProducts(userLat, userLng, true); // silent=true: no loading state, no scroll
    }, 15000);

    // Re-fetch when delivery address is updated in another tab/component
    function onStorageChange(e: StorageEvent) {
      if (e.key === "bubbry_delivery_lat" || e.key === "bubbry_delivery_lng") {
        const newLat = parseFloat(localStorage.getItem("bubbry_delivery_lat") || "");
        const newLng = parseFloat(localStorage.getItem("bubbry_delivery_lng") || "");
        if (!isNaN(newLat) && !isNaN(newLng)) {
          setUserLat(newLat); setUserLng(newLng);
          fetchProducts(newLat, newLng);
          fetchShops(newLat, newLng);
          fetchAds(newLat, newLng);
        }
      }
    }
    window.addEventListener("storage", onStorageChange);

    return () => {
      supabase.removeChannel(rt1);
      clearInterval(poll);
      window.removeEventListener("storage", onStorageChange);
    };
  }, []);

  // Auto-slide hero banners every 5 seconds
  useEffect(() => {
    if (heroBannerAds.length <= 1) return;
    const timer = setInterval(() => {
      setHeroBannerIndex(i => (i + 1) % heroBannerAds.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroBannerAds]);

  // Master products search — queries master_products table directly, like the shopkeeper app
  useEffect(() => {
    const q = search.trim();
    if (!q) { setMasterSearchResults([]); return; }

    setSearchLoading(true);
    const timer = setTimeout(async () => {
      // 1. Search master_products directly by name (ilike for partial match)
      // Search master_products by name AND brand AND category
      const [nameRes, brandRes, catRes] = await Promise.all([
        supabase.from("master_products").select("id, name, size, image_url, category, brand").ilike("name", `%${q}%`).limit(40),
        supabase.from("master_products").select("id, name, size, image_url, category, brand").ilike("brand", `%${q}%`).limit(20),
        supabase.from("master_products").select("id, name, size, image_url, category, brand").ilike("category", `%${q}%`).limit(20),
      ]);
      // Merge and deduplicate by id
      const seenIds = new Set<string>();
      const mpData = [...(nameRes.data||[]), ...(brandRes.data||[]), ...(catRes.data||[])]
        .filter((p: any) => { if (seenIds.has(p.id)) return false; seenIds.add(p.id); return true; });

      if (!mpData || mpData.length === 0) {
        setMasterSearchResults([]);
        setSearchLoading(false);
        return;
      }

      // 2. Build a map of productId → shopOption from allProductsRef (nearby live shops, any distance)
      const liveMap: Record<string, any> = {};
      (allProductsRef.current.length > 0 ? allProductsRef.current : products).forEach((p: any) => {
        if (!liveMap[p.product_id]) liveMap[p.product_id] = p;
      });

      // 3. Merge: master product + live shop data if available
      const merged = mpData.map((mp: any) => {
        const live = liveMap[mp.id];
        if (live) {
          // In stock at a nearby live shop — use full product card data
          return {
            ...live,
            name: live.name || mp.name,
            size: live.size || mp.size || "",
            image_url: mp.image_url || live.image_url || "",
            category: mp.category || live.category || "Other",
            brand: mp.brand || live.brand || "",
            _fromMaster: true,
          };
        }
        // Not available at any nearby live shop — show as out of stock
        return {
          id: mp.id,
          product_id: mp.id,
          name: mp.name,
          size: mp.size || "",
          image_url: mp.image_url || "",
          category: mp.category || "Other",
          brand: mp.brand || "",
          price: 0,
          stock: 0,
          inStock: false,
          shop_id: "",
          shop_name: "",
          distance: 999,
          offersDelivery: false,
          offersPickup: false,
          shopOptions: [],
          _fromMaster: true,
        };
      });

      // 4. Sort: in-stock first (nearest), then out-of-stock
      merged.sort((a: any, b: any) => {
        if (a.inStock && !b.inStock) return -1;
        if (!a.inStock && b.inStock) return 1;
        return (a.distance ?? 999) - (b.distance ?? 999);
      });

      // Include loose products directly from dedicated ref (always populated)
      const looseMatches = looseProductsRef.current
        .filter((p: any) =>
          (p.name ?? "").toLowerCase().includes(q.toLowerCase()) ||
          (p.loose_unit ?? "").toLowerCase().includes(q.toLowerCase()) ||
          q.toLowerCase().includes("loose") || q.toLowerCase().includes("bulk")
        );

      // Merge loose products with master results (no duplicates)
      const allResults = [...merged, ...looseMatches];
      allResults.sort((a: any, b: any) => {
        if (a.inStock && !b.inStock) return -1;
        if (!a.inStock && b.inStock) return 1;
        return (a.distance ?? 999) - (b.distance ?? 999);
      });

      setMasterSearchResults(allResults);
      setSearchLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Load all master_products when "All Products" filter is active (applied.inStock === false)
  useEffect(() => {
    if (applied.inStock) { setAllMasterProducts([]); return; }
    if (search.trim()) return;
    setAllMasterLoading(true);
    supabase.from("master_products")
      .select("id, name, size, image_url, category, brand")
      .order("name", { ascending: true })
      .then(({ data: mpData }: any) => {
        if (!mpData) { setAllMasterProducts([]); setAllMasterLoading(false); return; }
        const liveMap: Record<string, any> = {};
        const source = allProductsRef.current.length > 0 ? allProductsRef.current : products;
        source.forEach((p: any) => { if (!liveMap[p.product_id]) liveMap[p.product_id] = p; });
        const merged = mpData.map((mp: any) => {
          const live = liveMap[mp.id];
          if (live) {
            return { ...live, name: live.name || mp.name, size: live.size || mp.size || "", image_url: mp.image_url || live.image_url || "", category: mp.category || live.category || "Other", brand: mp.brand || live.brand || "" };
          }
          return { id: mp.id, product_id: mp.id, name: mp.name, size: mp.size || "", image_url: mp.image_url || "", category: mp.category || "Other", brand: mp.brand || "", price: 0, stock: 0, inStock: false, shop_id: "", shop_name: "", distance: 999, offersDelivery: false, offersPickup: false, shopOptions: [] };
        });
        merged.sort((a: any, b: any) => {
          if (a.inStock && !b.inStock) return -1;
          if (!a.inStock && b.inStock) return 1;
          if (a.inStock) return (a.distance ?? 999) - (b.distance ?? 999);
          return (a.name ?? "").localeCompare(b.name ?? "");
        });
        setAllMasterProducts(merged);
        setAllMasterLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applied.inStock, products.length]);

  async function loadUserData() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const uid = session.user.id;

      // Check for open fraud dispute — blocks ordering
      const { data: openDispute } = await supabase
        .from("disputes")
        .select("id")
        .eq("customer_id", uid)
        .eq("status", "open")
        .eq("reason", "fraud_customer")
        .limit(1)
        .maybeSingle();
      if (openDispute) {
        setTempBanned(true);
      } else {
        setTempBanned(false);
      }

      // Check permanent ban
      const { data: profileBan } = await supabase.from("profiles").select("banned").eq("id", uid).single();
      if (profileBan?.banned) {
        await supabase.auth.signOut();
        window.location.href = "/login?banned=1";
        return;
      }

      const [wl, bm, nc] = await Promise.all([
        supabase.from("wishlists").select("product_id, shop_id").eq("customer_id", uid),
        supabase.from("shop_bookmarks").select("shop_id").eq("customer_id", uid),
        supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", uid).eq("read", false),
      ]);
      setWishlistIds(new Set((wl.data || []).map((w: any) => w.product_id + "_" + w.shop_id)));
      setBookmarkIds(new Set((bm.data || []).map((b: any) => b.shop_id)));
      setNotifCount(nc.count || 0);
      supabase.channel("dash-notif-rt").on("postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" }, () => setNotifCount(n => n + 1)
      ).subscribe();
    } catch(e) { console.error(e); }
  }

  async function toggleWishlist(productId: string, shopId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    const key = productId + "_" + shopId;
    if (wishlistIds.has(key)) {
      await supabase.from("wishlists").delete().eq("customer_id", session.user.id).eq("product_id", productId).eq("shop_id", shopId);
      setWishlistIds(prev => { const s = new Set(prev); s.delete(key); return s; });
    } else {
      await supabase.from("wishlists").insert({ customer_id: session.user.id, product_id: productId, shop_id: shopId, added_at: new Date().toISOString() });
      setWishlistIds(prev => new Set([...prev, key]));
    }
  }

  async function toggleBookmark(shopId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    if (bookmarkIds.has(shopId)) {
      await supabase.from("shop_bookmarks").delete().eq("customer_id", session.user.id).eq("shop_id", shopId);
      setBookmarkIds(prev => { const s = new Set(prev); s.delete(shopId); return s; });
    } else {
      await supabase.from("shop_bookmarks").insert({ customer_id: session.user.id, shop_id: shopId, added_at: new Date().toISOString() });
      setBookmarkIds(prev => new Set([...prev, shopId]));
    }
  }

  async function fetchCategories() {
    const { data } = await supabase.from("categories").select("id, name, image_url").order("sort_order", { ascending: true });
    if (data && data.length > 0) setCategories(data);
  }

  async function deleteAddress(id: string) {
    setDeletingAddrId(id);
    await supabase.from("customer_addresses").delete().eq("id", id);
    setSavedAddresses(prev => prev.filter(a => a.id !== id));
    setDeletingAddrId(null);
  }

  async function setActiveAddress(addr: any) {
    // Set as the active delivery address
    setEditAddress(addr.address);
    setEditLat(addr.lat);
    setEditLng(addr.lng);
    localStorage.setItem("bubbry_address", addr.address);
    localStorage.setItem("bubbry_delivery_lat", addr.lat.toString());
    localStorage.setItem("bubbry_delivery_lng", addr.lng.toString());
    if (addr.instructions) localStorage.setItem("bubbry_delivery_instructions", addr.instructions);
    // Update profile default
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from("profiles").update({
        default_address: addr.address,
        default_lat: addr.lat,
        default_lng: addr.lng,
        default_instructions: addr.instructions || "",
      }).eq("id", session.user.id);
    }
    alert("✓ Active delivery address updated!");
  }

  async function loadProfile() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    const { data } = await supabase.from("profiles")
      .select("id, name, email, phone, default_address, default_lat, default_lng, default_instructions")
      .eq("id", session.user.id).single();
    if (data) {
      setProfileData(data);
      setEditName(data.name || "");
      setEditEmail(data.email || "");
      setEditPhone(data.phone || "");
      setEditAddress(data.default_address || "");
      setEditLat(data.default_lat || null);
      setEditLng(data.default_lng || null);
      // Also sync to localStorage so cart picks it up
      if (data.default_address) {
        localStorage.setItem("bubbry_address", data.default_address);
        if (data.default_lat) localStorage.setItem("bubbry_delivery_lat", data.default_lat.toString());
        if (data.default_lng) localStorage.setItem("bubbry_delivery_lng", data.default_lng.toString());
      }
    }
    // Load saved addresses
    const { data: addrs } = await supabase.from("customer_addresses")
      .select("id, label, address, lat, lng, instructions")
      .eq("customer_id", session.user.id)
      .order("created_at", { ascending: true });
    setSavedAddresses(addrs || []);
  }

  async function saveProfile() {
    setSavingProfile(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) { setSavingProfile(false); return; }
    const { error } = await supabase.from("profiles").update({
      name: editName,
      default_address: editAddress,
      default_lat: editLat,
      default_lng: editLng,
    }).eq("id", session.user.id);
    // Sync to localStorage
    if (!error && editAddress) {
      localStorage.setItem("bubbry_address", editAddress);
      if (editLat) localStorage.setItem("bubbry_delivery_lat", editLat.toString());
      if (editLng) localStorage.setItem("bubbry_delivery_lng", editLng.toString());
    }
    if (error) { alert("Failed to save: " + error.message); }
    else {
      setProfileData((p: any) => ({ ...p, name: editName, default_address: editAddress }));
      alert("✓ Profile saved!");
    }
    setSavingProfile(false);
  }

  function openProfile() {
    loadProfile();
    // Also load current saved delivery location
    const savedAddr = localStorage.getItem("bubbry_address");
    const savedLat = localStorage.getItem("bubbry_delivery_lat");
    const savedLng = localStorage.getItem("bubbry_delivery_lng");
    if (savedAddr && !editAddress) setEditAddress(savedAddr);
    if (savedLat && !editLat) setEditLat(parseFloat(savedLat));
    if (savedLng && !editLng) setEditLng(parseFloat(savedLng));
    setShowProfile(true);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    // Clear ALL user-specific data from localStorage
    localStorage.removeItem("bubbry_cart");
    localStorage.removeItem("bubbry_address");
    localStorage.removeItem("bubbry_delivery_lat");
    localStorage.removeItem("bubbry_delivery_lng");
    localStorage.removeItem("bubbry_delivery_instructions");
    localStorage.removeItem("bubbry_order_type");
    localStorage.removeItem("bubbry_rider");
    localStorage.removeItem("bubbry_user_id");
    window.location.href = "/login";
  }

  // Apply sponsored shop as primary display shop for each product
  function applySponsoredOverride(items: any[]): any[] {
    return items.map(p => {
      const ad = sponsoredProductsRef.current.find((a:any) =>
        Array.isArray(a.sponsored_product_ids) &&
        a.sponsored_product_ids.includes(p.product_id) &&
        a.shop_id
      );
      if (!ad) return p;
      const opt = (p.shopOptions || []).find((s:any) => s.shop_id === ad.shop_id);
      if (!opt) return p;
      return {
        ...p,
        id: opt.id,
        shop_id: opt.shop_id,
        shop_name: opt.shop_name,
        price: opt.price,
        stock: opt.stock,
        offersDelivery: opt.offersDelivery,
        offersPickup: opt.offersPickup,
        _sponsored: true,
      };
    });
  }

  async function fetchProducts(lat?: number, lng?: number, silent = false) {
    if (!silent) setLoading(true);

    // Fetch ALL shop_products including loose products
    const { data: spData } = await supabase
      .from("shop_products")
      .select("id, price, stock, product_id, shop_id, name, size, is_loose, loose_unit, loose_min_qty, loose_max_qty, price_per_unit")
      .gte("stock", 0);

    if (!spData || spData.length === 0) {
      if (!silent) { setProducts([]); setLoading(false); }
      return;
    }

    // Fetch only live shops
    const shopIds = [...new Set(spData.map((r:any) => r.shop_id).filter(Boolean))];
    const { data: shopData } = shopIds.length > 0
      ? await supabase.from("profiles")
          .select("id, name, shop_name, latitude, longitude, is_live, offers_delivery, offers_pickup, delivery_range_km")
          .in("id", shopIds)
          .eq("is_live", true)
      : { data: [] };

    const shopMap: any = {};
    (shopData||[]).forEach((s:any) => {
      if (lat && lng && s.latitude && s.longitude) {
        const dist = distance(lat, lng, s.latitude, s.longitude);
        // Use shop's own delivery range (default 2km, max 2km)
        const shopRangeKm = Math.min(s.delivery_range_km || 2, 2);
        if (dist > shopRangeKm) return; // skip shops outside their delivery range
      }
      shopMap[s.id] = s;
    });

    // Filter to only live shops within radius
    const liveSpData = spData.filter((sp:any) => shopMap[sp.shop_id]);

    // Fetch master_products for extra info (image, category, brand)
    const productIds = [...new Set(liveSpData.map((r:any) => r.product_id).filter(Boolean))];
    const { data: mpData } = productIds.length > 0
      ? await supabase.from("master_products").select("id, name, size, image_url, category, subcategory, brand").in("id", productIds)
      : { data: [] };
    const mpMap: any = {};
    (mpData||[]).forEach((mp:any) => { mpMap[mp.id] = mp; });

    // Group shop_products by product_id — keep ALL shop options sorted by distance
    const spByProduct: Record<string, any[]> = {};
    liveSpData.forEach((sp:any) => {
      if (!spByProduct[sp.product_id]) spByProduct[sp.product_id] = [];
      const shop = shopMap[sp.shop_id];
      const dist = (lat && lng && shop?.latitude && shop?.longitude)
        ? distance(lat, lng, shop.latitude, shop.longitude) : 0;
      spByProduct[sp.product_id].push({ ...sp, dist, shop });
    });

    // Separate loose products (no product_id) into their own list
    const looseProducts: any[] = (spData || [])
      .filter((sp: any) => sp.is_loose && !sp.product_id && shopMap[sp.shop_id])
      .map((sp: any) => {
        const shop = shopMap[sp.shop_id];
        return {
          id: sp.id,
          product_id: sp.id, // use shop_products.id as key
          name: sp.name,
          size: `Per ${sp.loose_unit || "kg"}`,
          price: sp.price,
          price_per_unit: sp.price_per_unit || sp.price,
          stock: sp.stock,
          inStock: (sp.stock ?? 0) > 0,
          image_url: "",
          category: "Loose Products",
          brand: "",
          shop_id: sp.shop_id,
          shop_name: shop?.shop_name || shop?.name || "Shop",
          distance: shop?.dist || 0,
          is_loose: true,
          loose_unit: sp.loose_unit || "kg",
          loose_min_qty: sp.loose_min_qty || 0.25,
          loose_max_qty: sp.loose_max_qty || 10,
          shopOptions: [],
          _sponsored: false,
        };
      });

    const items: any[] = Object.entries(spByProduct).map(([productId, shopOptions]: [string, any[]]) => {
      const mp = mpMap[productId] || {};
      // Check if this product has a sponsored ad
      const sponsorAd = sponsoredProductsRef.current.find((a:any) =>
        Array.isArray(a.sponsored_product_ids) && a.sponsored_product_ids.includes(productId) && a.shop_id
      );
      // Sort: sponsored shop first, then by distance
      shopOptions.sort((a:any, b:any) => {
        const aIsSponsor = sponsorAd && a.shop_id === sponsorAd.shop_id ? 1 : 0;
        const bIsSponsor = sponsorAd && b.shop_id === sponsorAd.shop_id ? 1 : 0;
        if (bIsSponsor !== aIsSponsor) return bIsSponsor - aIsSponsor;
        return a.dist - b.dist;
      });
      const bestSp = shopOptions[0];
      const isProductSponsored = !!(sponsorAd && bestSp.shop_id === sponsorAd?.shop_id);
      return {
        id: bestSp.id,
        product_id: productId,
        name: bestSp.name || mp.name || "Product",
        size: bestSp.size || mp.size || "",
        price: bestSp.price ?? 0,
        stock: bestSp.stock ?? 0,
        image_url: mp.image_url ?? "",
        category: mp.category || mp.subcategory || "Other",
        brand: mp.brand ?? "",
        shop_id: bestSp.shop_id ?? "",
        shop_name: bestSp.shop?.shop_name || bestSp.shop?.name || "",
        distance: bestSp.dist ?? 0,
        inStock: shopOptions.some((sp: any) => (sp.stock ?? 0) > 0),
        offersDelivery: bestSp?.shop?.offers_delivery ?? false,
        offersPickup: bestSp?.shop?.offers_pickup ?? true,
        _sponsored: isProductSponsored,
        // All shops that have this product in stock
        shopOptions: shopOptions.map((sp:any) => ({
          id: sp.id,
          shop_id: sp.shop_id,
          shop_name: sp.shop?.shop_name || sp.shop?.name || "Shop",
          price: sp.price,
          stock: sp.stock,
          inStock: (sp.stock ?? 0) > 0,
          distance: sp.dist,
          offersDelivery: sp.shop?.offers_delivery ?? false,
          offersPickup: sp.shop?.offers_pickup ?? true,
        })),
      };
    });

    items.sort((a, b) => {
      if (a.inStock && !b.inStock) return -1;
      if (!a.inStock && b.inStock) return 1;
      return a.distance - b.distance;
    });
    // Apply sponsored shop override immediately if ads already loaded
    looseProductsRef.current = looseProducts;
    const withSponsored = applySponsoredOverride([...items, ...looseProducts]);
    // For silent refreshes: save scroll position before state update, restore after
    if (silent && contentRef.current) {
      scrollSaveRef.current = contentRef.current.scrollTop;
    }
    setProducts(withSponsored);
    if (!silent) setLoading(false);
    // Restore scroll position after silent update (next paint)
    if (silent && scrollSaveRef.current > 0) {
      requestAnimationFrame(() => {
        if (contentRef.current) contentRef.current.scrollTop = scrollSaveRef.current;
      });
    }
    // Store raw items so we can re-apply when ads load
    rawProductsRef.current = [...items, ...looseProducts];

    // Build allProductsRef — same product list but WITHOUT 2km cap, for search
    // Include all live shops regardless of distance
    const allShopMap: any = {};
    (shopData||[]).forEach((s:any) => { allShopMap[s.id] = s; }); // shopData already has all live shops
    const allSpData = spData.filter((sp:any) => allShopMap[sp.shop_id] && !sp.is_loose);
    const allByProduct: Record<string, any[]> = {};
    allSpData.forEach((sp:any) => {
      if (!sp.product_id) return; // skip loose products here
      const shop = allShopMap[sp.shop_id];
      const dist = (lat && lng && shop?.latitude && shop?.longitude)
        ? distance(lat, lng, shop.latitude, shop.longitude) : 999;
      if (!allByProduct[sp.product_id]) allByProduct[sp.product_id] = [];
      allByProduct[sp.product_id].push({ ...sp, dist, shop });
    });
    // Add loose products to allProductsRef for search
    const looseForSearch = (spData || [])
      .filter((sp:any) => sp.is_loose && !sp.product_id && allShopMap[sp.shop_id])
      .map((sp:any) => {
        const shop = allShopMap[sp.shop_id];
        const dist = (lat && lng && shop?.latitude && shop?.longitude)
          ? distance(lat, lng, shop.latitude, shop.longitude) : 999;
        return {
          id: sp.id, product_id: sp.id, name: sp.name,
          size: `Per ${sp.loose_unit || "kg"}`, price: sp.price,
          price_per_unit: sp.price_per_unit || sp.price,
          stock: sp.stock ?? 999, inStock: (sp.stock ?? 0) > 0 || sp.stock === null,
          image_url: "", category: "Loose Products",
          brand: "", shop_id: sp.shop_id,
          shop_name: shop?.shop_name || shop?.name || "",
          distance: dist, is_loose: true, loose_unit: sp.loose_unit || "kg",
          loose_min_qty: sp.loose_min_qty || 0.25,
          loose_max_qty: sp.loose_max_qty || 10,
          offersDelivery: shop?.offers_delivery ?? false,
          offersPickup: shop?.offers_pickup ?? true,
          shopOptions: [],
        };
      });

    allProductsRef.current = Object.entries(allByProduct).map(([productId, opts]: [string, any[]]) => {
      const mp = mpMap[productId] || {};
      opts.sort((a:any,b:any) => a.dist - b.dist);
      const best = opts[0];
      return {
        id: best.id,
        product_id: productId,
        name: best.name || mp.name || "Product",
        size: best.size || mp.size || "",
        price: best.price ?? 0,
        stock: best.stock ?? 0,
        image_url: mp.image_url ?? "",
        category: mp.category || mp.subcategory || "Other",
        brand: mp.brand ?? "",
        shop_id: best.shop_id ?? "",
        shop_name: best.shop?.shop_name || best.shop?.name || "",
        distance: best.dist ?? 999,
        inStock: opts.some((sp:any) => (sp.stock ?? 0) > 0),
        offersDelivery: best.shop?.offers_delivery ?? false,
        offersPickup: best.shop?.offers_pickup ?? true,
        shopOptions: opts.map((sp:any) => ({
          id: sp.id, shop_id: sp.shop_id,
          shop_name: sp.shop?.shop_name || sp.shop?.name || "Shop",
          price: sp.price, stock: sp.stock, inStock: (sp.stock??0)>0,
          distance: sp.dist, offersDelivery: sp.shop?.offers_delivery ?? false,
          offersPickup: sp.shop?.offers_pickup ?? true,
        })),
      };
    });
  }

  async function fetchShops(lat?: number, lng?: number) {
    const { data } = await supabase
      .from("profiles")
      .select("id, name, shop_name, latitude, longitude, is_live, offers_delivery, offers_pickup, shopfront_image, delivery_range_km")
      .eq("role", "shopkeeper")
      .eq("is_live", true);
    if (!data) return;
    const nearby = data
      .map((s: any) => {
        const dist = (lat && lng && s.latitude && s.longitude)
          ? distance(lat, lng, s.latitude, s.longitude) : 0;
        return { ...s, distance: dist };
      })
      .filter((s: any) => {
        if (!lat || !lng) return true; // no location — show all
        // Use shop's own delivery range (capped at 2km max)
        const shopRange = Math.min(s.delivery_range_km || 2, 2);
        return s.distance <= shopRange;
      })
      .sort((a: any, b: any) => a.distance - b.distance);
    setNearbyShops(nearby);
  }

  async function fetchAds(lat?: number, lng?: number) {
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase
      .from("ads")
      .select("*, profiles!ads_shop_id_fkey(latitude, longitude)")
      .eq("active", true)
      .or(`paid_until.is.null,paid_until.gte.${today}`);
    if (!data) return;
    const filtered = data.filter((ad: any) => {
      if (!lat || !lng || !ad.shop_id) return true;
      const sLat = ad.profiles?.latitude;
      const sLng = ad.profiles?.longitude;
      if (!sLat || !sLng) return true;
      return distance(lat, lng, sLat, sLng) <= 2;
    });
    setHeroBannerAds(filtered.filter((a:any) => a.slot === "hero_banner"));
    setHeroBannerIndex(0);
    setFeaturedShops(filtered.filter((a:any) => a.slot === "featured_shop"));
    const spAds = filtered.filter((a:any) => a.slot === "sponsored_product");
    setSponsoredProducts(spAds);
    sponsoredProductsRef.current = spAds;
    // Build a Set of all sponsored product_ids for fast O(1) lookup
    const ids = new Set<string>();
    spAds.forEach((ad:any) => {
      if (Array.isArray(ad.sponsored_product_ids)) {
        ad.sponsored_product_ids.forEach((id:string) => ids.add(id));
      }
      // legacy: if no product_ids but has shop/category, mark shop+category as sponsored
    });
    setSponsoredProductIds(ids);
    sponsoredProductIdsRef.current = ids;
    // Re-apply sponsored override to products now that we have ad data
    // Rebuild products with sponsored sort now that we have ad data
    if (rawProductsRef.current.length > 0) {
      // Re-sort each product's shopOptions with sponsored shop first
      const rebulit = rawProductsRef.current.map(p => {
        const sponsorAd = spAds.find((a:any) =>
          Array.isArray(a.sponsored_product_ids) && a.sponsored_product_ids.includes(p.product_id) && a.shop_id
        );
        if (!sponsorAd) return p;
        const opts = [...(p.shopOptions || [])].sort((a:any, b:any) => {
          const aS = a.shop_id === sponsorAd.shop_id ? 1 : 0;
          const bS = b.shop_id === sponsorAd.shop_id ? 1 : 0;
          if (bS !== aS) return bS - aS;
          return a.distance - b.distance;
        });
        const best = opts[0];
        if (!best) return p;
        return {
          ...p,
          id: best.id,
          shop_id: best.shop_id,
          shop_name: best.shop_name,
          price: best.price,
          stock: best.stock,
          offersDelivery: best.offersDelivery,
          offersPickup: best.offersPickup,
          shopOptions: opts,
          _sponsored: best.shop_id === sponsorAd.shop_id,
        };
      });
      if (contentRef.current) scrollSaveRef.current = contentRef.current.scrollTop;
      setProducts(rebulit);
      requestAnimationFrame(() => {
        if (contentRef.current && scrollSaveRef.current > 0) contentRef.current.scrollTop = scrollSaveRef.current;
      });
    }
  }

  async function openShop(shop: any) {
    setSelectedShop(shop);
    setShopLoading(true);
    const { data: spData } = await supabase
      .from("shop_products")
      .select("id, price, stock, product_id, name, size")
      .eq("shop_id", shop.id)
      .gt("stock", 0);
    if (!spData || spData.length === 0) { setShopProducts([]); setShopLoading(false); return; }
    const productIds = spData.map((r: any) => r.product_id).filter(Boolean);
    const { data: mpData } = productIds.length > 0
      ? await supabase.from("master_products").select("id, name, size, image_url, category, brand").in("id", productIds)
      : { data: [] };
    const mpMap: any = {};
    (mpData || []).forEach((mp: any) => { mpMap[mp.id] = mp; });
    const items = spData.map((sp: any) => ({
      id: sp.id,
      product_id: sp.product_id,
      name: sp.name || mpMap[sp.product_id]?.name || "Product",
      size: sp.size || mpMap[sp.product_id]?.size || "",
      price: sp.price,
      stock: sp.stock,
      image_url: mpMap[sp.product_id]?.image_url || "",
      category: mpMap[sp.product_id]?.category || "Other",
      brand: mpMap[sp.product_id]?.brand || "",
      shop_id: shop.id,
      shop_name: shop.shop_name || shop.name,
      inStock: true,
      distance: shop.distance,
      offersDelivery: shop.offers_delivery,
      offersPickup: shop.offers_pickup,
    }));
    setShopProducts(items);
    setShopLoading(false);
  }

  // Auto-open shop from ?shop= query param (used by wishlist bookmarks)
  // Runs only when ?shop= is present; strips the param immediately so page refresh returns to home
  useEffect(() => {
    const shopId = searchParams.get("shop");
    if (!shopId) return;
    // Strip the param from URL immediately — prevents re-opening on refresh
    router.replace("/customer-dashboard", { scroll: false });
    supabase.from("profiles")
      .select("id, shop_name, name, latitude, longitude, offers_delivery, offers_pickup, shopfront_image, is_live")
      .eq("id", shopId).single()
      .then(({ data: sh }: any) => {
        if (!sh) return;
        sh.distance = 0;
        sh.shopfront_image = sh.shopfront_image || "";
        setViewMode("shops");
        openShop(sh);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function getQty(id:string) { return cart.find((i) => i.id === id)?.quantity ?? 0; }

  function addProductFromShop(product: any, shopOpt: any) {
    // product is the base product, shopOpt is the specific shop entry
    const cartItem = {
      ...product,
      id: shopOpt.id,
      shop_id: shopOpt.shop_id,
      shop_name: shopOpt.shop_name,
      price: shopOpt.price,
      stock: shopOpt.stock,
    };
    // Enforce single-shop rule
    if (cart.length > 0 && cartShopId && shopOpt.shop_id !== cartShopId) {
      if (!confirm(`Your cart has items from ${cart[0].shop_name}. Clear cart and add from ${shopOpt.shop_name}?`)) return;
      setCart([{ ...cartItem, quantity: 1 }]);
      setCartShopId(shopOpt.shop_id);
      localStorage.setItem("bubbry_cart", JSON.stringify([{ ...cartItem, quantity: 1 }]));
      return;
    }
    setCartShopId(shopOpt.shop_id);
    updateCart(cartItem, 1);
  }

  function updateCart(product:any, delta:number) {
    if (!product.inStock && delta > 0) return;
    let updated: any[];
    const existing = cart.find((i) => i.id === product.id);
    if (existing) {
      const nq = (existing.quantity ?? 1) + delta;
      if (nq <= 0) {
        updated = cart.filter((i) => i.id !== product.id);
        if (updated.length === 0) setCartShopId("");
      } else if (nq > (product.stock ?? 99)) {
        alert(`Only ${product.stock} in stock`);
        return;
      } else {
        updated = cart.map((i) => i.id === product.id ? {...i, quantity:nq} : i);
      }
    } else {
      if ((product.stock ?? 0) < 1) return;
      if (cart.length > 0 && cartShopId && product.shop_id !== cartShopId) {
        if (!confirm(`Your cart has items from ${cart[0].shop_name}. Clear cart and add from ${product.shop_name}?`)) return;
        updated = [{ ...product, quantity: 1 }];
        setCartShopId(product.shop_id);
        setCart(updated);
        localStorage.setItem("bubbry_cart", JSON.stringify(updated));
        return;
      }
      if (!cartShopId) setCartShopId(product.shop_id);
      updated = [...cart, {...product, quantity:1}];
    }
    setCart(updated);
    localStorage.setItem("bubbry_cart", JSON.stringify(updated));
  }

  // Derived data
  const shops = [...new Set(products.flatMap((p:any) =>
    p.shopOptions ? p.shopOptions.map((s:any) => s.shop_name) : [p.shop_name]
  ).filter(Boolean))];
  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];
  const activeFilterCount = [applied.shop, applied.brand, applied.minPrice||applied.maxPrice, !applied.inStock?"y":"", applied.orderType !== "both" ? applied.orderType : ""].filter(Boolean).length;

  // Filter products
  function applyFilters(list: any[]) {
    return list.filter((p) => {
      // Shop filter: check ALL shopOptions not just the primary shop
      if (applied.shop) {
        const allShopNames = (p.shopOptions || []).map((s:any) => s.shop_name);
        if (!allShopNames.includes(applied.shop) && p.shop_name !== applied.shop) return false;
      }
      if (applied.brand && p.brand !== applied.brand) return false;
      if (applied.inStock && !p.inStock) return false; // only filter when "In Stock Only" is active
      // For price/delivery filter, check if ANY shopOption matches
      const relevantOptions = applied.shop
        ? (p.shopOptions || []).filter((s:any) => s.shop_name === applied.shop)
        : (p.shopOptions || [{ price: p.price, offersDelivery: p.offersDelivery, offersPickup: p.offersPickup }]);
      if (applied.minPrice && p.inStock && relevantOptions.every((s:any) => s.price < Number(applied.minPrice))) return false;
      if (applied.maxPrice && p.inStock && relevantOptions.every((s:any) => s.price > Number(applied.maxPrice))) return false;
      if (applied.orderType === "delivery" && relevantOptions.every((s:any) => !s.offersDelivery)) return false;
      if (applied.orderType === "pickup" && relevantOptions.every((s:any) => !s.offersPickup)) return false;
      return true;
    }).map((p) => {
      // PRIORITY 1: Sponsored shop override — always takes precedence over nearest shop
      const sponsoringAd = sponsoredProductsRef.current.find((ad:any) =>
        Array.isArray(ad.sponsored_product_ids) &&
        ad.sponsored_product_ids.includes(p.product_id) &&
        ad.shop_id
      );
      if (sponsoringAd && p.shopOptions) {
        const sponsorOpt = p.shopOptions.find((s:any) => s.shop_id === sponsoringAd.shop_id);
        if (sponsorOpt) {
          return {
            ...p,
            id: sponsorOpt.id,
            shop_id: sponsorOpt.shop_id,
            shop_name: sponsorOpt.shop_name,
            price: sponsorOpt.price,
            stock: sponsorOpt.stock,
            offersDelivery: sponsorOpt.offersDelivery,
            offersPickup: sponsorOpt.offersPickup,
            _sponsored: true,
          };
        }
      }
      // PRIORITY 2: Shop filter override
      if (applied.shop && p.shopOptions) {
        const matchedOpt = p.shopOptions.find((s:any) => s.shop_name === applied.shop);
        if (matchedOpt) {
          return {
            ...p,
            id: matchedOpt.id,
            shop_id: matchedOpt.shop_id,
            shop_name: matchedOpt.shop_name,
            price: matchedOpt.price,
            stock: matchedOpt.stock,
            offersDelivery: matchedOpt.offersDelivery,
            offersPickup: matchedOpt.offersPickup,
          };
        }
      }
      return p;
    }); // sorting is handled by sortWithSponsored
  }

  // Check if a product is sponsored (by product_id or by shop+category match)
  function isSponsored(p: any): boolean {
    if (sponsoredProductIdsRef.current.has(p.product_id)) return true;
    return sponsoredProductsRef.current.some((ad:any) =>
      !ad.sponsored_product_ids?.length &&
      ad.shop_id === p.shop_id &&
      (!ad.link_category || ad.link_category === p.category)
    );
  }

  // Sorting: sponsored products always float to top, then apply normal sort
  function sortWithSponsored(list: any[]): any[] {
    return [...list].sort((a, b) => {
      const aSp = (sponsoredProductIdsRef.current.has(a.product_id) || a._sponsored) ? 1 : 0;
      const bSp = (sponsoredProductIdsRef.current.has(b.product_id) || b._sponsored) ? 1 : 0;
      if (bSp !== aSp) return bSp - aSp; // sponsored first
      // Then in-stock first
      if (a.inStock && !b.inStock) return -1;
      if (!a.inStock && b.inStock) return 1;
      // Then normal sort
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "popularity") return (b.stock ?? 0) - (a.stock ?? 0);
      return a.distance - b.distance;
    });
  }

  // Products for search
  const searchResults = search.trim()
    ? sortWithSponsored(
        // Search ALL products including loose products and all categories
        (allProductsRef.current.length > 0 ? allProductsRef.current : products)
          .filter((p) =>
            (p.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
            (p.brand ?? "").toLowerCase().includes(search.toLowerCase()) ||
            (p.category ?? "").toLowerCase().includes(search.toLowerCase()) ||
            (p.size ?? "").toLowerCase().includes(search.toLowerCase())
          )
          .sort((a, b) => {
            // In-stock first, then by distance
            if (a.inStock && !b.inStock) return -1;
            if (!a.inStock && b.inStock) return 1;
            return (a.distance ?? 999) - (b.distance ?? 999);
          })
      )
    : [];

  // Products grouped by category (for home view)
  // Start with categories table order, then append any extra categories from products
  const baseCatOrder = categories.length > 0
    ? categories.map((c:any) => c.name)
    : [];
  const allProductCats = [...new Set(products.map((p:any) => p.category).filter(Boolean))];
  const extraCats = allProductCats.filter((cat:string) => !baseCatOrder.includes(cat));
  const catOrder = [...baseCatOrder, ...extraCats];

  const grouped: Record<string, any[]> = {};
  sortWithSponsored(applyFilters(products)).forEach((p) => {
    const cat = p.category || "Other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(p);
  });

  // Master grouped — used on home tab when "All Products" filter is active
  const masterGrouped: Record<string, any[]> = {};
  allMasterProducts.forEach((p) => {
    const cat = p.category || "Other";
    if (!masterGrouped[cat]) masterGrouped[cat] = [];
    masterGrouped[cat].push(p);
  });
  // Use categories table order for master too, append any extras
  const masterExtraCats = [...new Set(allMasterProducts.map((p:any) => p.category).filter(Boolean))]
    .filter((c:string) => !baseCatOrder.includes(c));
  const masterCatOrder = [...baseCatOrder, ...masterExtraCats];

  // Products for active category tab — sponsored first
  // When "All Products" filter is active (applied.inStock=false), include out-of-stock
  const tabProducts = activeTab === "home" ? [] : sortWithSponsored(
    applyFilters(products.filter((p) => p.category === activeTab))
  );

  const cartTotal = cart.reduce((s,i) => s + i.price * (i.quantity ?? 1), 0);
  const cartCount = cart.reduce((s,i) => s + (i.quantity ?? 1), 0);

  function switchTab(tabName: string) {
    setActiveTab(tabName);
    setSearch("");
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  function ProductCard({ p }: { p:any }) {
    const multiShop = (p.shopOptions?.length ?? 1) > 1;
    // Find if this product (any shop) is in cart
    const cartItem = cart.find((i:any) => i.product_id === p.product_id);
    const qty = cartItem ? (cartItem.quantity ?? 1) : 0;
    const cartSp = cartItem ? p.shopOptions?.find((s:any) => s.id === cartItem.id) : null;
    // If filter is active, p.shop_name/price are already overridden by applyFilters — use them directly
    // Only fall back to shopOptions[0] when no filter and no cart item
    const displayShop = cartSp || (applied.shop ? null : p.shopOptions?.[0]) || p;
    const displayPrice = displayShop?.price ?? p.price;
    const displayShopName = displayShop?.shop_name ?? p.shop_name;

    function handleAdd() {
      if (multiShop && qty === 0) {
        setShopSelectorProduct(p);
        return;
      }
      if (qty === 0) {
        addProductFromShop(p, p.shopOptions?.[0] || p);
      } else {
        updateCart(cartItem, 1);
      }
    }

    return (
      <div className="product-card" style={{opacity: p.inStock ? 1 : 0.72}}>
        <div className="product-img-wrap" style={{position:"relative"}}>
          <button onClick={e => { e.stopPropagation(); toggleWishlist(p.product_id, p.shop_id); }}
            style={{position:"absolute",top:6,right:6,width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.92)",border:"none",cursor:"pointer",fontSize:13,zIndex:3,boxShadow:"0 2px 6px rgba(0,0,0,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {wishlistIds.has(p.product_id+"_"+p.shop_id)?"❤️":"🤍"}
          </button>
          {p.image_url
            ? <img src={p.image_url} alt={p.name} className="product-img" />
            : <div className="product-img-placeholder">🛍️</div>}
          {p.inStock && p.stock > 0 && p.stock < 5 && <div className="low-stock-badge">Low Stock</div>}
          {multiShop && <div className="multi-shop-badge">{p.shopOptions.length} shops</div>}
          {(p._sponsored || sponsoredProductIdsRef.current.has(p.product_id) || sponsoredProductsRef.current.some((ad:any) => !ad.sponsored_product_ids?.length && ad.shop_id === p.shop_id && (!ad.link_category || ad.link_category === p.category))) &&
            <div className="sponsored-product-badge">Sponsored</div>
          }
          {!p.inStock && (
            <div className="out-of-stock-overlay">
              <div className="out-of-stock-badge">Out of Stock</div>
            </div>
          )}
        </div>
        <div className="product-info">
          <div className="product-name">{p.name}</div>
          {p.size && <div className="product-size-tag">{p.size}</div>}
          {p.inStock
            ? <div className="product-shop-tag" style={{cursor: multiShop ? "pointer" : "default"}} onClick={() => multiShop && qty === 0 && setShopSelectorProduct(p)}>
                🏪 {displayShopName}{multiShop && qty === 0 ? <span style={{color:"#1A6BFF",marginLeft:4,fontSize:10}}>▼</span> : ""}
              </div>
            : <div className="product-shop-tag" style={{color:"#FF6B2B"}}>Not available nearby</div>}
          {/* Loose product — amount input */}
          {p.is_loose && p.inStock ? (
            <div style={{marginTop:6}} onClick={e => e.stopPropagation()}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:13,fontWeight:900,color:"#1A6BFF"}}>₹{p.price}<span style={{fontSize:10,fontWeight:600,color:"#8A96B5"}}>/{p.loose_unit||"kg"}</span></span>
                {looseAmounts[p.id || p.product_id] && parseFloat(looseAmounts[p.id || p.product_id]) > 0 && (
                  <span style={{fontSize:10,color:"#00875A",fontWeight:700}}>≈ {(parseFloat(looseAmounts[p.id || p.product_id])/p.price).toFixed(2)}{p.loose_unit||"kg"}</span>
                )}
              </div>
              <div style={{display:"flex",gap:6}}>
                <input type="number" placeholder="Enter ₹ amount"
                  value={looseAmounts[p.id || p.product_id] || ""}
                  onChange={e => setLooseAmounts(prev => ({...prev, [p.id || p.product_id]: e.target.value}))}
                  onClick={e => e.stopPropagation()}
                  style={{flex:1,padding:"7px 9px",border:"1.5px solid #E4EAFF",borderRadius:8,fontSize:12,fontFamily:"inherit",outline:"none",minWidth:0,width:"100%"}}/>
                <button onClick={e => {
                  e.stopPropagation();
                  const amt = parseFloat(looseAmounts[p.id || p.product_id] || "0");
                  if (!amt || amt <= 0) { alert("Enter an amount in ₹"); return; }
                  const minAmt = Math.ceil((p.loose_min_qty||0.25) * p.price);
                  const maxAmt = Math.floor((p.loose_max_qty||10) * p.price);
                  if (amt < minAmt) { alert(`Minimum order is ₹${minAmt} (${p.loose_min_qty||0.25} ${p.loose_unit||"kg"})`); return; }
                  if (amt > maxAmt) { alert(`Maximum order is ₹${maxAmt} (${p.loose_max_qty||10} ${p.loose_unit||"kg"})`); return; }
                  const qty = parseFloat((amt / p.price).toFixed(3));
                  addProductFromShop(p, {...(p.shopOptions?.[0] || p), customAmount: amt, customQty: qty, name: `${p.name} (${qty}${p.loose_unit||"kg"})`, price: amt, quantity: 1});
                  setLooseAmounts(prev => ({...prev, [p.id || p.product_id]: ""}));
                }}
                  style={{padding:"7px 11px",background:"#1A6BFF",color:"white",border:"none",borderRadius:8,fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>
                  Add
                </button>
              </div>
            </div>
          ) : (
            <div className="product-footer">
              <div className="product-price" style={{color: p.inStock ? "#0D1B3E" : "#B0BACC"}}>
                {p.inStock ? `₹${displayPrice}` : "—"}
              </div>
              {p.inStock ? (
                qty === 0
                  ? <button className="add-btn" onClick={handleAdd}>+</button>
                  : <div className="qty-ctrl">
                      <button className="qty-btn" onClick={() => updateCart(cartItem, -1)}>−</button>
                      <div className="qty-num">{qty}</div>
                      <button className="qty-btn" onClick={() => updateCart(cartItem, 1)} disabled={qty >= (displayShop?.stock ?? 99)} style={{opacity: qty >= (displayShop?.stock ?? 99) ? 0.4 : 1, cursor: qty >= (displayShop?.stock ?? 99) ? "not-allowed" : "pointer"}}>+</button>
                    </div>
              ) : (
                <button className="add-btn" disabled>+</button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Build sidebar items — when "All Products" active, show all master categories; otherwise only stocked ones
  const sidebarCatOrder = !applied.inStock && allMasterProducts.length > 0 ? masterCatOrder : catOrder;
  const sidebarGrouped = !applied.inStock && allMasterProducts.length > 0 ? masterGrouped : grouped;
  const sidebarItems = [
    { key: "home", label: "Home", img: "", icon: "🏠" },
    ...sidebarCatOrder.filter((n:string) => sidebarGrouped[n] && sidebarGrouped[n].length > 0).map((name:string) => {
      const catData = categories.find((c:any) => c.name === name);
      return { key: name, label: name, img: catData?.image_url || "", icon: CAT_ICONS[name] ?? "🛍️" };
    })
  ];

  // Show full-screen restriction notice if customer is temp-banned pending dispute resolution
  if (tempBanned) {
    return (
      <div style={{minHeight:"100vh",background:"#FFF0F0",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Plus Jakarta Sans',sans-serif",padding:24}}>
        <div style={{background:"white",borderRadius:20,padding:32,maxWidth:400,width:"100%",textAlign:"center",boxShadow:"0 8px 40px rgba(229,62,62,0.15)",border:"2px solid #FFCDD2"}}>
          <div style={{fontSize:56,marginBottom:16}}>🚫</div>
          <div style={{fontSize:20,fontWeight:900,color:"#E53E3E",marginBottom:8}}>Account Temporarily Restricted</div>
          <div style={{fontSize:14,color:"#4A5880",lineHeight:1.6,marginBottom:20}}>
            Your account has been temporarily restricted while our team reviews a payment dispute filed against you.
          </div>
          <div style={{background:"#FFF8E6",borderRadius:12,padding:"12px 16px",marginBottom:20,textAlign:"left"}}>
            <div style={{fontSize:12,fontWeight:800,color:"#946200",marginBottom:6}}>What happens next:</div>
            <div style={{fontSize:13,color:"#4A5880",lineHeight:1.7}}>
              • Our team will review the evidence within 24 hours<br/>
              • You may be contacted on your registered phone number<br/>
              • If the dispute is resolved in your favour, your account will be fully restored<br/>
              • If found guilty, your account will be permanently banned
            </div>
          </div>
          <div style={{fontSize:13,color:"#8A96B5",marginBottom:20}}>
            Questions? Email us at <strong style={{color:"#1A6BFF"}}>support@bubbry.in</strong>
          </div>
          <button
            onClick={() => supabase.auth.signOut().then(() => window.location.href = "/login")}
            style={{width:"100%",padding:14,background:"#E53E3E",color:"white",border:"none",borderRadius:12,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <style>{CSS}</style>

      {/* Header */}
      <div className="top-bar">
        <div className="top-bar-row1">
          <div className="brand">🫧 Bubbry</div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <a href="/notifications" style={{position:"relative",width:36,height:36,background:"rgba(255,255,255,0.15)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none",color:"white",fontSize:18}}>
              🔔
              {notifCount > 0 && <span style={{position:"absolute",top:-3,right:-3,background:"#E53E3E",color:"white",fontSize:9,fontWeight:900,borderRadius:8,padding:"1px 4px",lineHeight:1.2}}>{notifCount > 9?"9+":notifCount}</span>}
            </a>
            <a href="/wishlist" style={{width:36,height:36,background:"rgba(255,255,255,0.15)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none",color:"white",fontSize:18}}>
              ❤️
            </a>
            <a href="/cart" className="cart-fab">
              🛒 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </a>
            <button className="profile-btn" onClick={openProfile} title="My Profile">👤</button>
          </div>
        </div>
        <div className="search-bar">
          <span style={{fontSize:16}}>🔍</span>
          <input
            placeholder="Search products, brands..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); if (e.target.value) setActiveTab("home"); }}
          />
          {search && <span style={{cursor:"pointer",color:"#B0BACC",fontSize:16,flexShrink:0}} onClick={() => setSearch("")}>✕</span>}
        </div>
      </div>

      {/* Sort bar */}
      <div className="sort-bar">
        <button className={`sort-chip ${sortBy==="distance"?"active":""}`} onClick={() => setSortBy("distance")}>📍 Nearest</button>
        <button className={`sort-chip ${sortBy==="price_asc"?"active":""}`} onClick={() => setSortBy("price_asc")}>₹ Low–High</button>
        <button className={`sort-chip ${sortBy==="price_desc"?"active":""}`} onClick={() => setSortBy("price_desc")}>₹ High–Low</button>
        <button className={`sort-chip ${sortBy==="popularity"?"active":""}`} onClick={() => setSortBy("popularity")}>🔥 Popular</button>
        <button className={`sort-chip ${applied.orderType==="pickup"||applied.orderType==="both"?"active":""}`} onClick={() => {
          // Toggle pickup: if both on, turn off delivery (pickup only). If pickup only, keep (can't deselect). If delivery only, switch to both.
          const next = applied.orderType === "delivery" ? "both" : applied.orderType === "both" ? "pickup" : "both";
          setFOrderType(next as any);
          setApplied((p) => ({...p, orderType: next}));
        }}>🏪 Pickup</button>
        <button className={`sort-chip ${applied.orderType==="delivery"||applied.orderType==="both"?"active":""}`} onClick={() => {
          // Toggle delivery: if both on, turn off pickup (delivery only). If delivery only, keep. If pickup only, switch to both.
          const next = applied.orderType === "pickup" ? "both" : applied.orderType === "both" ? "delivery" : "both";
          setFOrderType(next as any);
          setApplied((p) => ({...p, orderType: next}));
        }}>🛵 Delivery</button>
        <button className={`sort-chip ${activeFilterCount>0?"active":""}`} onClick={() => setShowFilter(true)}>
          🎛 Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </button>
      </div>

      {/* SHOPS SEARCH BAR — visible when in shops mode and no shop selected */}
      {viewMode === "shops" && !selectedShop && (
        <div className="shop-search-bar">
          <span style={{fontSize:16,color:"#B0BACC"}}>🔍</span>
          <input
            placeholder="Search shops by name..."
            value={searchShops}
            onChange={e => setSearchShops(e.target.value)}
          />
          {searchShops && <span style={{cursor:"pointer",color:"#B0BACC",fontSize:16}} onClick={() => setSearchShops("")}>✕</span>}
        </div>
      )}

      {/* SHOPS VIEW */}
      {viewMode === "shops" && !selectedShop && (
        <div>
          {nearbyShops.length === 0 ? (
            <div className="no-shops">
              <div style={{fontSize:56,marginBottom:12}}>📍</div>
              <div style={{fontSize:18,fontWeight:900,color:"#0D1B3E",marginBottom:8}}>No shops nearby</div>
              <div style={{fontSize:14,color:"#8A96B5",fontWeight:500,lineHeight:1.6}}>No live shops found within 2km of your location. Check back soon!</div>
            </div>
          ) : (
            <div className="shops-list">
              <div className="shops-count">📍 {nearbyShops.length} shop{nearbyShops.length!==1?"s":""} near you</div>
              {featuredShops.length > 0 && nearbyShops.some((s:any) => featuredShops.find((a:any) => a.shop_id === s.id)) &&
                nearbyShops.filter((s:any) => featuredShops.find((a:any) => a.shop_id === s.id)).map((shop:any) => (
                  <div key={"feat_"+shop.id} className="shop-card" onClick={() => openShop(shop)} style={{border:"2px solid #FFB800",position:"relative"}}>
                    <div style={{position:"absolute",top:10,left:10,zIndex:5,background:"#FFB800",color:"#0D1B3E",fontSize:10,fontWeight:800,padding:"3px 8px",borderRadius:6}}>🏆 FEATURED</div>
                    {shop.shopfront_image ? <img src={shop.shopfront_image} alt={shop.shop_name} className="shop-cover" /> : <div className="shop-cover-placeholder">🏪</div>}
                    <div className="shop-card-body">
                      <div className="shop-card-row1"><div className="shop-card-name">{shop.shop_name || shop.name}</div><div className="shop-rating">⭐ Featured</div></div>
                      <div className="shop-card-meta"><span>🟢 Open</span><span className="shop-meta-dot">·</span><span>📍 {shop.distance < 1 ? `${Math.round(shop.distance*1000)}m` : `${shop.distance.toFixed(1)}km`}</span></div>
                      <div className="shop-card-tags">{shop.offers_pickup && <span className="shop-tag green">🏃 Pickup</span>}{shop.offers_delivery && <span className="shop-tag orange">🛵 Delivery</span>}</div>
                    </div>
                  </div>
                ))
              }
              {nearbyShops.filter((shop:any) => !searchShops || (shop.shop_name||shop.name||"").toLowerCase().includes(searchShops.toLowerCase())).map((shop:any) => (
                <div key={shop.id} className="shop-card" onClick={() => openShop(shop)}>
                  {shop.shopfront_image
                    ? <img src={shop.shopfront_image} alt={shop.shop_name} className="shop-cover" />
                    : <div className="shop-cover-placeholder">🏪</div>}
                  <div className="shop-card-body">
                    <div className="shop-card-row1">
                      <div className="shop-card-name" style={{flex:1}}>{shop.shop_name || shop.name}</div>
                      <button onClick={e=>{e.stopPropagation();toggleBookmark(shop.id);}}
                        style={{background:"none",border:"none",fontSize:20,cursor:"pointer",padding:"0 4px",lineHeight:1,marginLeft:6}}>
                        {bookmarkIds.has(shop.id)?"🔖":"🏷️"}
                      </button>
                    </div>
                    <div className="shop-card-meta">
                      <span>🟢 Open</span>
                      <span className="shop-meta-dot">·</span>
                      <span>📍 {shop.distance < 1 ? `${Math.round(shop.distance*1000)}m` : `${shop.distance.toFixed(1)}km`}</span>
                      {shop.offers_delivery && <><span className="shop-meta-dot">·</span><span>🛵 Delivery</span></>}
                    </div>
                    <div className="shop-card-tags">
                      {shop.offers_pickup && <span className="shop-tag green">🏃 Pickup available</span>}
                      {shop.offers_delivery && <span className="shop-tag orange">🛵 Delivery</span>}
                      {!shop.offers_delivery && <span className="shop-tag">Pickup only</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SHOP DETAIL VIEW */}
      {viewMode === "shops" && selectedShop && (
        <div style={{minHeight:"100vh",background:"#F4F6FB"}}>
          {/* Sticky header */}
          <div className="shop-detail-header">
            <button className="shop-detail-back-btn" onClick={() => setSelectedShop(null)}>←</button>
            <div style={{flex:1}}>
              <div className="shop-detail-title">{selectedShop.shop_name || selectedShop.name}</div>
              <div className="shop-detail-sub">
                📍 {selectedShop.distance < 1 ? `${Math.round(selectedShop.distance*1000)}m` : `${selectedShop.distance.toFixed(1)}km`}
                {selectedShop.offers_pickup ? " · 🏃 Pickup" : ""}
                {selectedShop.offers_delivery ? " · 🛵 Delivery" : ""}
              </div>
            </div>
            {cartCount > 0 && (
              <a href="/cart" style={{background:"white",color:"#1A6BFF",padding:"7px 12px",borderRadius:10,fontSize:12,fontWeight:800,textDecoration:"none",flexShrink:0}}>
                🛒 {cartCount}
              </a>
            )}
          </div>

          {/* Hero cover photo */}
          {selectedShop.shopfront_image
            ? <img src={selectedShop.shopfront_image} alt="Shop" className="shop-hero-img" />
            : <div style={{width:"100%",height:180,background:"linear-gradient(135deg,#1A6BFF,#4D8FFF)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:64}}>🏪</div>
          }

          {/* Shop info bar */}
          <div className="shop-info-bar">
            <div className="shop-info-stat">🟢 Open Now</div>
            <div className="shop-info-stat">📦 {shopProducts.length} items</div>
            <div className="shop-info-stat">📍 {selectedShop.distance < 1 ? `${Math.round(selectedShop.distance*1000)}m` : `${selectedShop.distance.toFixed(1)}km`} away</div>
            {selectedShop.offers_delivery && <div className="shop-info-stat">🛵 Delivery</div>}
          </div>

          {/* Products */}
          {shopLoading ? (
            <div style={{padding:48,textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:12}}>⏳</div>
              <div style={{color:"#8A96B5",fontWeight:600}}>Loading products...</div>
            </div>
          ) : shopProducts.length === 0 ? (
            <div style={{padding:48,textAlign:"center"}}>
              <div style={{fontSize:48,marginBottom:12}}>📭</div>
              <div style={{fontSize:16,fontWeight:800,color:"#0D1B3E"}}>Nothing in stock right now</div>
              <div style={{fontSize:13,color:"#8A96B5",marginTop:6}}>This shop hasn't added any products yet.</div>
            </div>
          ) : (
            <div className="shop-products-area">
              {[...new Set(shopProducts.map((p:any)=>p.category))].map((cat:any) => (
                <div key={cat as string}>
                  <div className="shop-cat-title">
                    <span>{CAT_ICONS[cat as string]??"🛍️"}</span>
                    <span>{cat as string}</span>
                    <span style={{fontSize:12,color:"#B0BACC",fontWeight:600,marginLeft:"auto"}}>
                      {shopProducts.filter((p:any)=>p.category===cat).length} items
                    </span>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    {shopProducts.filter((p:any)=>p.category===cat).map((product:any) => {
                      const qty = getQty(product.id);
                      return (
                        <div key={product.id} className="product-card">
                          <div className="product-img-wrap" style={{position:"relative"}}>
                            {product.image_url
                              ? <img src={product.image_url} alt={product.name} className="product-img" />
                              : <div className="product-img-placeholder">{CAT_ICONS[product.category]??"🛍️"}</div>}
                            {product.stock < 5 && <div className="low-stock-badge">Low Stock</div>}
                          </div>
                          <div className="product-info">
                            <div className="product-name">{product.name}</div>
                            {product.size && <div className="product-size-tag">{product.size}</div>}
                            <div className="product-footer">
                              <div className="product-price">₹{product.price}</div>
                              {qty === 0
                                ? <button className="add-btn" onClick={() => addProductFromShop(product, { id: product.id, shop_id: product.shop_id, shop_name: product.shop_name, price: product.price, stock: product.stock, offersDelivery: product.offersDelivery, offersPickup: product.offersPickup })}>+</button>
                                : <div className="qty-ctrl">
                                    <button className="qty-btn" onClick={() => updateCart(product,-1)}>−</button>
                                    <div className="qty-num">{qty}</div>
                                    <button className="qty-btn" onClick={() => updateCart(product,1)} disabled={qty >= (product.stock ?? 99)} style={{opacity: qty >= (product.stock ?? 99) ? 0.4 : 1, cursor: qty >= (product.stock ?? 99) ? "not-allowed" : "pointer"}}>+</button>
                                  </div>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Floating cart bar */}
          {cartCount > 0 && (
            <div style={{position:"fixed",bottom:76,left:0,right:0,padding:"0 16px",zIndex:150}}>
              <a href="/cart" style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#1A6BFF",color:"white",borderRadius:16,padding:"14px 18px",textDecoration:"none",boxShadow:"0 8px 24px rgba(26,107,255,0.4)"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"3px 8px",fontSize:13,fontWeight:800}}>{cartCount}</div>
                  <span style={{fontSize:14,fontWeight:700}}>item{cartCount!==1?"s":""} in cart</span>
                </div>
                <span style={{fontSize:14,fontWeight:800}}>View Cart →</span>
              </a>
            </div>
          )}
        </div>
      )}

      {/* PRODUCTS VIEW */}
      {viewMode === "products" && <div>
      {/* Main layout */}
      <div className="main-layout" style={{paddingBottom: cartCount > 0 ? 0 : 0}}>

        {/* LEFT SIDEBAR */}
        <div className="sidebar">
          {sidebarItems.map((item) => (
            <div
              key={item.key}
              className={`sidebar-item ${activeTab === item.key ? "active" : ""}`}
              onClick={() => switchTab(item.key)}
            >
              <div className="sidebar-img">
                {item.img
                  ? <img src={item.img} alt={item.label} onError={(e:any) => { e.target.style.display="none"; e.target.parentNode.innerHTML = `<span style='font-size:22px'>${item.icon}</span>`; }} />
                  : <span style={{fontSize:22}}>{item.icon}</span>}
              </div>
              <div className="sidebar-label">{item.key === "home" ? "Home" : item.label.replace(" & ", "\n& ").split(" ").slice(0,3).join(" ")}</div>
            </div>
          ))}
        </div>

        {/* RIGHT CONTENT */}
        <div className="content-area" ref={contentRef} style={{paddingBottom: cartCount > 0 ? 140 : 80}}>

          {loading ? (
            <div style={{padding:14}}>
              <div className="skeleton" style={{height:130,borderRadius:18,marginBottom:14}}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[...Array(4)].map((_,i) => <div key={i} className="skeleton" style={{height:200,borderRadius:14}}/>)}
              </div>
            </div>
          ) : search.trim() ? (
            /* SEARCH RESULTS — from master_products catalog */
            <div className="search-results">
              {searchLoading ? (
                <div style={{textAlign:"center",padding:"40px 0",color:"#8A96B5",fontWeight:600}}>🔍 Searching...</div>
              ) : masterSearchResults.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">🔍</div><div className="empty-title">No results for "{search}"</div><div className="empty-sub">Try a different name or spelling</div></div>
              ) : (
                <>
                  {/* In-stock section */}
                  {masterSearchResults.some(p => p.inStock) && (
                    <>
                      <div className="search-label" style={{marginBottom:8}}>
                        ✅ Available nearby — {masterSearchResults.filter(p=>p.inStock).length} product{masterSearchResults.filter(p=>p.inStock).length!==1?"s":""}
                      </div>
                      <div className="search-grid" style={{marginBottom:16}}>
                        {masterSearchResults.filter(p => p.inStock).map((p) => <ProductCard key={p.product_id || p.id} p={p} />)}
                      </div>
                    </>
                  )}
                  {/* Out-of-stock section */}
                  {masterSearchResults.some(p => !p.inStock) && (
                    <>
                      <div className="search-label" style={{marginBottom:8,marginTop:masterSearchResults.some(p=>p.inStock)?4:0}}>
                        🏪 Not available nearby — {masterSearchResults.filter(p=>!p.inStock).length} product{masterSearchResults.filter(p=>!p.inStock).length!==1?"s":""}
                      </div>
                      <div className="search-grid">
                        {masterSearchResults.filter(p => !p.inStock).map((p) => <ProductCard key={p.product_id} p={p} />)}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          ) : activeTab === "home" ? (
            /* HOME TAB */
            <>
              {/* Hero */}
              {heroBannerAds.length > 0 ? (
                <div>
                  {(()=>{const ad=heroBannerAds[heroBannerIndex]; return (
                    <div className="ad-hero-banner" key={heroBannerIndex} style={{background: ad.bg_color || "#1A6BFF"}}
                      onClick={() => {
                        if (ad.shop_id) {
                          // Find the shop in nearbyShops and open it
                          const s = nearbyShops.find((s:any) => s.id === ad.shop_id);
                          if (s) { setViewMode("shops"); openShop(s); }
                          else {
                            // Shop not in nearbyShops yet — fetch and open directly
                            supabase.from("profiles").select("id,shop_name,name,latitude,longitude,offers_delivery,offers_pickup,shopfront_image,is_live").eq("id",ad.shop_id).single().then(({data:sh}:any) => {
                              if (sh) { sh.distance=0; sh.shopfront_image=sh.shopfront_image||""; setViewMode("shops"); openShop(sh); }
                            });
                          }
                        } else if (ad.link_category) {
                          switchTab(ad.link_category);
                        }
                      }}>
                      <div className="ad-sponsored-chip">Sponsored</div>
                      <div className="hero-text" style={{zIndex:1}}>
                        <div className="hero-tag">⚡ {ad.subtitle || "Featured"}</div>
                        <div className="hero-title">{ad.title}</div>
                        <div className="hero-sub">{ad.shop_name || ""}</div>
                        <div className="hero-btn" style={{display:"inline-block",background:"white",color:"#1A6BFF",padding:"8px 18px",borderRadius:10,fontSize:13,fontWeight:800,cursor:"pointer"}}>{ad.cta || "Shop Now"} →</div>
                      </div>
                      <div className="hero-icon" style={{zIndex:1}}>{ad.emoji || "🛒"}</div>
                    </div>
                  );})()}
                  {heroBannerAds.length > 1 && (
                    <div className="banner-dots">
                      {heroBannerAds.map((_:any,i:number) => (
                        <button key={i} className={`banner-dot ${i===heroBannerIndex?"active":""}`} onClick={()=>setHeroBannerIndex(i)} />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="hero">
                  <div className="hero-text">
                    <div className="hero-tag">⚡ Quick delivery</div>
                    <div className="hero-title">Daily essentials, delivered fast</div>
                    <div className="hero-sub">Get groceries from shops near you</div>
                    <button className="hero-btn" onClick={() => switchTab(catOrder[0] || "home")}>Shop Now →</button>
                  </div>
                  <div className="hero-icon">🛒</div>
                </div>
              )}

              {/* Mini banners */}
              <div className="mini-section">
                <div className="mini-section-title">Shop by Need</div>
                <div className="mini-banners">
                  {MINI_BANNERS.map((b,i) => (
                    <div key={i} className="mini-banner" style={{background:b.bg}} onClick={() => switchTab(b.cat)}>
                      <div>
                        <div className="mini-banner-tag">{b.tag}</div>
                        <div className="mini-banner-title">{b.title}</div>
                        <div className="mini-banner-sub">{b.sub}</div>
                        <div className="mini-banner-btn">Order Now</div>
                      </div>
                      <div className="mini-banner-emoji">{b.emoji}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Shop Ads */}
              {featuredShops.length > 0 && (
                <div style={{marginTop:10}}>
                  <div className="mini-section-title" style={{padding:"0 14px",marginBottom:8}}>🏆 Featured Shops</div>
                  <div className="ad-featured-row">
                    {featuredShops.map((ad:any) => (
                      <div key={ad.id} className="ad-featured-card" style={{background:`linear-gradient(135deg, ${ad.bg_color||"#1A6BFF"}, ${ad.bg_color||"#1A6BFF"}cc)`}}
                        onClick={() => { if (ad.shop_id) { const shop = nearbyShops.find((s:any)=>s.id===ad.shop_id); if(shop){setViewMode("shops");openShop(shop);} } }}>
                        <div className="ad-featured-label">⭐ Featured</div>
                        <div className="ad-featured-name">{ad.shop_name || ad.title}</div>
                        {ad.subtitle && <div style={{fontSize:10,color:"rgba(255,255,255,0.7)",fontWeight:600,marginBottom:4}}>{ad.subtitle}</div>}
                        <div className="ad-featured-cta">{ad.cta || "Visit Shop"} →</div>
                        <div className="ad-featured-emoji">{ad.emoji || "🏪"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Each category section with 2-col grid */}
              {!applied.inStock ? (
                /* ALL PRODUCTS MODE — show full master_products catalog grouped by category */
                allMasterLoading ? (
                  <div style={{textAlign:"center",padding:"40px 0",color:"#8A96B5",fontWeight:600}}>Loading all products...</div>
                ) : (
                  <>
                    <div style={{background:"#FFF8E1",padding:"8px 14px",fontSize:12,fontWeight:700,color:"#B45309",display:"flex",alignItems:"center",gap:6,marginTop:4}}>
                      🌐 Showing all products from catalog — including those not available nearby
                    </div>
                    {masterCatOrder.filter((cat:string) => masterGrouped[cat]?.length > 0).map((cat:string) => {
                      const items = masterGrouped[cat] || [];
                      const inStockItems = items.filter((p:any) => p.inStock);
                      const outItems = items.filter((p:any) => !p.inStock);
                      return (
                        <div key={cat} id={`cat-${cat}`}>
                          <div className="cat-section-hdr">
                            <div className="cat-section-title">
                              <span>{CAT_ICONS[cat] ?? "🛍️"}</span>
                              <span>{cat}</span>
                            </div>
                            <div className="cat-section-count">{inStockItems.length} nearby · {items.length} total</div>
                          </div>
                          {inStockItems.length > 0 && (
                            <>
                              <div className="search-label" style={{padding:"4px 14px 4px"}}>✅ Available nearby</div>
                              <div className="cat-products-grid">{inStockItems.map((p:any) => <ProductCard key={p.product_id} p={p} />)}</div>
                            </>
                          )}
                          {outItems.length > 0 && (
                            <>
                              <div className="search-label" style={{padding:"8px 14px 4px"}}>🏪 Not available nearby</div>
                              <div className="cat-products-grid">{outItems.map((p:any) => <ProductCard key={p.product_id} p={p} />)}</div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </>
                )
              ) : (
                /* IN STOCK ONLY MODE — show nearby live shop products grouped by category */
                catOrder.filter((cat:string) => grouped[cat]?.length > 0).map((cat:string) => {
                  const items = grouped[cat] || [];
                  const inStockCount = items.filter((p:any) => p.inStock).length;
                  return (
                    <div key={cat} id={`cat-${cat}`}>
                      <div className="cat-section-hdr">
                        <div className="cat-section-title">
                          <span>{CAT_ICONS[cat] ?? "🛍️"}</span>
                          <span>{cat}</span>
                        </div>
                        <div className="cat-section-count">{inStockCount} in stock</div>
                      </div>
                      <div className="cat-products-grid">
                        {items.map((p:any) => <ProductCard key={p.product_id} p={p} />)}
                      </div>
                    </div>
                  );
                })
              )}
            </>
          ) : (
            /* CATEGORY TAB */
            <>
              {!applied.inStock && (
                <div style={{background:"#FFF8E1",padding:"8px 14px",fontSize:12,fontWeight:700,color:"#B45309",display:"flex",alignItems:"center",gap:6}}>
                  🌐 Showing all products from catalog — including those not available nearby
                </div>
              )}
              <div className="cat-section-hdr">
                <div className="cat-section-title">
                  <span>{CAT_ICONS[activeTab] ?? "🛍️"}</span>
                  <span>{activeTab}</span>
                </div>
                <div className="cat-section-count">
                  {applied.inStock
                    ? `${tabProducts.filter((p:any) => p.inStock).length} in stock`
                    : (() => {
                        const catAll = allMasterProducts.filter((p:any) => p.category === activeTab);
                        return `${catAll.filter((p:any)=>p.inStock).length} nearby · ${catAll.length} total`;
                      })()
                  }
                </div>
              </div>
              {applied.inStock ? (
                tabProducts.length === 0
                  ? <div className="empty-state"><div className="empty-icon">🏪</div><div className="empty-title">No shops are live right now</div><div className="empty-sub">Shops need to go live before their products appear. Check back soon!</div></div>
                  : <div className="cat-products-grid">{tabProducts.map((p:any) => <ProductCard key={p.product_id} p={p} />)}</div>
              ) : (
                allMasterLoading
                  ? <div style={{textAlign:"center",padding:"40px 0",color:"#8A96B5",fontWeight:600}}>Loading all products...</div>
                  : (() => {
                      const catAll = allMasterProducts.filter((p:any) => p.category === activeTab);
                      return catAll.length === 0
                        ? <div className="empty-state"><div className="empty-icon">🛍️</div><div className="empty-title">No products in this category</div></div>
                        : (
                          <>
                            {catAll.some((p:any) => p.inStock) && (
                              <>
                                <div className="search-label" style={{padding:"8px 14px 4px"}}>✅ Available nearby</div>
                                <div className="cat-products-grid">{catAll.filter((p:any)=>p.inStock).map((p:any) => <ProductCard key={p.product_id} p={p} />)}</div>
                              </>
                            )}
                            {catAll.some((p:any) => !p.inStock) && (
                              <>
                                <div className="search-label" style={{padding:"8px 14px 4px"}}>🏪 Not available nearby</div>
                                <div className="cat-products-grid">{catAll.filter((p:any)=>!p.inStock).map((p:any) => <ProductCard key={p.product_id} p={p} />)}</div>
                              </>
                            )}
                          </>
                        );
                    })()
              )}
            </>
          )}
        </div>
      </div>

      {/* Filter sheet */}
      {showFilter && (
        <>
          <div className="filter-sheet-overlay" onClick={() => setShowFilter(false)} />
          <div className="filter-sheet">
            <div className="sheet-handle" />
            <div className="sheet-title">Filter Products</div>
            {shops.length > 1 && (
              <div className="sheet-section">
                <div className="sheet-label">Shop</div>
                <div className="sheet-options">
                  <div className={`sheet-opt ${fShop===""?"active":""}`} onClick={() => setFShop("")}>All Shops</div>
                  {shops.map((s) => <div key={s} className={`sheet-opt ${fShop===s?"active":""}`} onClick={() => setFShop(s)}>{s}</div>)}
                </div>
              </div>
            )}
            {brands.length > 0 && (
              <div className="sheet-section">
                <div className="sheet-label">Brand</div>
                <div className="sheet-options">
                  <div className={`sheet-opt ${fBrand===""?"active":""}`} onClick={() => setFBrand("")}>All Brands</div>
                  {brands.map((b) => <div key={b} className={`sheet-opt ${fBrand===b?"active":""}`} onClick={() => setFBrand(b)}>{b}</div>)}
                </div>
              </div>
            )}
            <div className="sheet-section">
              <div className="sheet-label">Price Range (₹)</div>
              <div className="price-range">
                <input className="price-input" placeholder="Min" type="number" value={fMinPrice} onChange={(e) => setFMinPrice(e.target.value)} />
                <span style={{color:"#B0BACC",fontWeight:700}}>–</span>
                <input className="price-input" placeholder="Max" type="number" value={fMaxPrice} onChange={(e) => setFMaxPrice(e.target.value)} />
              </div>
            </div>
            <div className="sheet-section">
              <div className="sheet-label">Availability</div>
              <div className="sheet-options">
                <div className={`sheet-opt ${fInStock?"active":""}`} onClick={() => setFInStock(true)}>✅ In Stock Only</div>
                <div className={`sheet-opt ${!fInStock?"active":""}`} onClick={() => setFInStock(false)}>All Products</div>
              </div>
            </div>
            <div className="sheet-actions">
              <button className="btn-clear" onClick={() => {
                setFShop(""); setFBrand(""); setFMinPrice(""); setFMaxPrice(""); setFInStock(true);
                setApplied({ minPrice:"", maxPrice:"", shop:"", brand:"", inStock:true, orderType:"both" });
                setFOrderType("both");
                setShowFilter(false);
              }}>Clear All</button>
              <button className="btn-apply" onClick={() => {
                setApplied({ shop:fShop, brand:fBrand, minPrice:fMinPrice, maxPrice:fMaxPrice, inStock:fInStock, orderType:fOrderType });
                setShowFilter(false);
              {/* Order type filter */}
              <div style={{marginBottom:18}}>
                <div className="sheet-section-label">Order Type</div>
                <div className="sheet-opts-row">
                  <div className={`sheet-opt ${fOrderType==="both"?"active":""}`} onClick={() => setFOrderType("both")}>Both</div>
                  <div className={`sheet-opt ${fOrderType==="pickup"?"active":""}`} onClick={() => setFOrderType("pickup")}>🏪 Pickup Only</div>
                  <div className={`sheet-opt ${fOrderType==="delivery"?"active":""}`} onClick={() => setFOrderType("delivery")}>🛵 Delivery Only</div>
                </div>
              </div>
              }}>Apply Filters</button>
            </div>
          </div>
        </>
      )}

      {/* Floating cart */}
      {cartCount > 0 && (
        <a href="/cart" className="cart-float">
          <div className="cart-float-left">
            {cartCount} item{cartCount!==1?"s":""} in cart
            <strong>₹{cartTotal.toFixed(0)}</strong>
          </div>
          <div className="cart-float-right">View Cart →</div>
        </a>
      )}

      </div>} {/* end products view */}

      {/* Cart locked to shop banner */}
      {cartShopId && cart.length > 0 && (
        <div className="cart-locked-banner">
          🔒 Cart locked to: <strong style={{marginLeft:4}}>{cart[0]?.shop_name}</strong>
          <button className="clear-cart-btn" onClick={() => { if(confirm("Clear cart?")) { setCart([]); setCartShopId(""); localStorage.removeItem("bubbry_cart"); } }}>Clear cart</button>
        </div>
      )}

      {/* Shop Selector Modal */}
      {shopSelectorProduct && (
        <div className="shop-selector-overlay" onClick={e => { if (e.target === e.currentTarget) setShopSelectorProduct(null); }}>
          <div className="shop-selector-sheet">
            <div className="shop-selector-handle" />
            <div className="shop-selector-title">
              Choose a Shop
              <div className="shop-selector-sub">{shopSelectorProduct.name} · {shopSelectorProduct.size}</div>
            </div>
            {(shopSelectorProduct.shopOptions || []).map((opt:any) => (
              <div key={opt.id} className="shop-option" onClick={() => {
                addProductFromShop(shopSelectorProduct, opt);
                setShopSelectorProduct(null);
              }}>
                <div className="shop-option-icon">🏪</div>
                <div style={{flex:1}}>
                  <div className="shop-option-name">{opt.shop_name}</div>
                  <div className="shop-option-meta">
                    📍 {opt.distance < 1 ? `${Math.round(opt.distance*1000)}m` : `${opt.distance.toFixed(1)}km`}
                    {opt.offersDelivery ? " · 🛵 Delivery" : ""}
                    {opt.offersPickup ? " · 🏃 Pickup" : ""}
                    {" · "}{opt.stock} in stock
                  </div>
                </div>
                <div className="shop-option-price">₹{opt.price}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Profile Sheet */}
      {showProfile && (
        <div className="profile-overlay" onClick={e => { if (e.target === e.currentTarget) setShowProfile(false); }}>
          <div className="profile-sheet">
            <div className="profile-handle" />
            <div className="profile-avatar">👤</div>
            <div className="profile-name-big">{editName || "Customer"}</div>
            <div className="profile-phone-big">{profileData?.phone || ""}</div>

            {/* Personal Info */}
            <div className="profile-section">
              <div className="profile-section-title">👤 Personal Details</div>
              <div className="profile-field">
                <div className="pf-label">Full Name</div>
                <input className="pf-input" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Your full name" />
              </div>
              <div className="profile-field">
                <div className="pf-label">Phone Number</div>
                <input className="pf-input" value={editPhone} readOnly style={{background:"#F4F6FB",color:"#8A96B5"}} />
              </div>
              <div className="profile-field">
                <div className="pf-label">Email</div>
                <input className="pf-input" value={editEmail} readOnly style={{background:"#F4F6FB",color:"#8A96B5"}} />
              </div>
            </div>

            {/* Delivery Addresses — up to 5 */}
            <div className="profile-section">
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                <div className="profile-section-title" style={{marginBottom:0}}>📍 Delivery Addresses</div>
                <div style={{fontSize:11,fontWeight:700,color:"#B0BACC"}}>{savedAddresses.length}/5 saved</div>
              </div>
              <div style={{fontSize:12,color:"#8A96B5",fontWeight:500,marginBottom:12}}>
                Tap an address to set it as active for your next order
              </div>

              {/* Active address indicator */}
              {editAddress && (
                <div style={{background:"#E6FAF4",border:"1.5px solid #B8E8D4",borderRadius:12,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"flex-start",gap:10}}>
                  <span style={{fontSize:18,flexShrink:0}}>✅</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:11,fontWeight:800,color:"#00875A",marginBottom:2}}>ACTIVE DELIVERY ADDRESS</div>
                    <div style={{fontSize:13,fontWeight:700,color:"#0D1B3E",lineHeight:1.4,wordBreak:"break-word"}}>{editAddress.split(" — ")[0]?.split(",").slice(0,3).join(", ")}</div>
                    {editAddress.includes(" — ") && <div style={{fontSize:12,color:"#1A6BFF",fontWeight:600,marginTop:2}}>{editAddress.split(" — ")[1]}</div>}
                  </div>
                </div>
              )}

              {/* Saved address list */}
              {savedAddresses.length === 0 && (
                <div style={{textAlign:"center",padding:"20px 0",color:"#B0BACC",fontSize:13,fontWeight:600}}>
                  No saved addresses yet — add one below
                </div>
              )}
              {savedAddresses.map((addr: any) => {
                const isActive = editAddress === addr.address;
                return (
                  <div key={addr.id} style={{
                    border: `1.5px solid ${isActive ? "#1A6BFF" : "#E4EAFF"}`,
                    borderRadius:12, padding:"10px 12px", marginBottom:8,
                    background: isActive ? "#EBF1FF" : "white",
                    display:"flex", alignItems:"flex-start", gap:10,
                  }}>
                    <span style={{fontSize:18,flexShrink:0,marginTop:1}}>
                      {addr.label === "Home" ? "🏠" : addr.label === "Work" ? "💼" : addr.label === "Other" ? "📍" : "📌"}
                    </span>
                    <div style={{flex:1,minWidth:0}} onClick={() => setActiveAddress(addr)}>
                      <div style={{fontSize:12,fontWeight:800,color:isActive?"#1A6BFF":"#8A96B5",marginBottom:2}}>
                        {addr.label}{isActive ? " · ACTIVE" : ""}
                      </div>
                      <div style={{fontSize:13,fontWeight:700,color:"#0D1B3E",lineHeight:1.4,wordBreak:"break-word"}}>
                        {addr.address.split(" — ")[0]?.split(",").slice(0,3).join(", ")}
                      </div>
                      {addr.instructions && (
                        <div style={{fontSize:12,color:"#4A5880",fontWeight:500,marginTop:2}}>{addr.instructions}</div>
                      )}
                    </div>
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      disabled={deletingAddrId === addr.id}
                      style={{background:"none",border:"none",color:"#FFCDD2",fontSize:18,cursor:"pointer",flexShrink:0,padding:"0 2px",lineHeight:1}}>
                      {deletingAddrId === addr.id ? "…" : "✕"}
                    </button>
                  </div>
                );
              })}

              {/* Add new address button — only if under 5 */}
              {savedAddresses.length < 5 && (
                <a href="/select-location" onClick={() => {
                  localStorage.setItem("bubbry_return_to_profile", "1");
                  setShowProfile(false);
                }} style={{display:"flex",alignItems:"center",gap:10,background:"#EBF1FF",border:"1.5px dashed #A3BFFF",borderRadius:12,padding:"12px 14px",textDecoration:"none",marginTop:4}}>
                  <span style={{fontSize:20}}>➕</span>
                  <div>
                    <div style={{fontSize:13,fontWeight:800,color:"#1A6BFF"}}>Add new address</div>
                    <div style={{fontSize:11,color:"#8A96B5",fontWeight:500}}>Pin on map + delivery instructions</div>
                  </div>
                  <span style={{marginLeft:"auto",fontSize:13,color:"#1A6BFF",fontWeight:700}}>→</span>
                </a>
              )}
              {savedAddresses.length >= 5 && (
                <div style={{fontSize:12,color:"#8A96B5",fontWeight:600,textAlign:"center",padding:"10px 0"}}>
                  Maximum 5 addresses reached. Delete one to add a new address.
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="profile-section">
              <button className="save-profile-btn" onClick={saveProfile} disabled={savingProfile}>
                {savingProfile ? "Saving..." : "✓ Save Profile"}
              </button>
            </div>

            {/* Logout */}
            <div className="profile-section">
              <button onClick={() => { setShowProfile(false); handleLogout(); }}
                style={{width:"100%",padding:14,background:"#FFF0F0",color:"#E53E3E",border:"1.5px solid #FFCDD2",borderRadius:14,fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="bottom-nav">
        <div className={`nav-item ${viewMode==="products"?"active":""}`} style={{cursor:"pointer"}} onClick={() => { setViewMode("products"); setSelectedShop(null); }}>
          <div className="nav-icon">🏠</div>Home
        </div>
        <div className={`nav-item ${viewMode==="shops"?"active":""}`} style={{cursor:"pointer"}} onClick={() => { setViewMode("shops"); setSelectedShop(null); setSearchShops(""); if (userLat && userLng) fetchShops(userLat, userLng); }}>
          <div className="nav-icon">🏪</div>Shops
        </div>
        <a href="/wishlist" className="nav-item"><div className="nav-icon">❤️</div>Wishlist</a>
        <a href="/my-orders" className="nav-item"><div className="nav-icon">📦</div>Orders</a>
        <a href="/help" className="nav-item"><div className="nav-icon">💬</div>Help</a>
      </nav>
    </div>
  );
}
