import { css } from 'lit';

export const compactStyles = css`
  .compact-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    text-align: start;
  }

  .compact-item.image-top {
    flex-direction: column;
  }

  .compact-item.image-end {
    flex-direction: row-reverse;
  }

  .compact-content {
    flex: 1;
    min-width: 0;
  }

  .compact-title {
    font-size: 1em;
    font-weight: 500;
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .compact-summary {
    font-size: 0.85em;
    opacity: 0.75;
    margin-top: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .compact-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
  }

  .carousel-container {
    position: relative;
    min-height: 48px;
  }

  .carousel-item {
    transition: opacity 0.4s ease, transform 0.4s ease;
  }

  .carousel-item.fade-out {
    opacity: 0;
  }

  .carousel-item.slide-out {
    opacity: 0;
    transform: translateX(-20px);
  }

  [dir='rtl'] .carousel-item.slide-out {
    transform: translateX(20px);
  }

  .carousel-dots {
    display: flex;
    justify-content: center;
    gap: 4px;
    margin-top: 8px;
  }

  .carousel-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--divider-color, rgba(0, 0, 0, 0.2));
  }

  .carousel-dot.active {
    background: var(--primary-color);
  }

  .list-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .list-item {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
  }

  .list-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .card-item {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .card-item.image-top .item-image,
  .card-item.image-top .placeholder-image {
    width: 100%;
    height: 160px;
  }

  .magazine-item {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    min-height: 180px;
  }

  .magazine-bg {
    width: 100%;
    height: 180px;
    object-fit: cover;
    display: block;
  }

  .magazine-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(transparent 30%, rgba(0, 0, 0, 0.75));
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 16px;
    color: #fff;
  }

  .magazine-title {
    font-size: 1.1em;
    font-weight: 600;
    line-height: 1.3;
  }
`;
