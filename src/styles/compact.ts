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

  .article-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
    flex-wrap: wrap;
  }

  .list-items {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .list-item {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 12px 0;
    border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
  }

  .list-item:first-child {
    padding-top: 0;
  }

  .list-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .list-content {
    flex: 1;
    min-width: 0;
  }

  .list-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
  }

  .list-title {
    font-size: 0.95em;
    font-weight: 500;
    line-height: 1.35;
    flex: 1;
    min-width: 0;
  }

  .list-summary {
    font-size: 0.82em;
    opacity: 0.72;
    margin-top: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-item {
    display: flex;
    flex-direction: column;
    gap: 0;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.02));
  }

  .card-item.image-top .item-image,
  .card-item.image-top .placeholder-image {
    width: 100%;
    height: 180px;
    border-radius: 0;
  }

  .card-body {
    padding: 12px 14px 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .card-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
  }

  .card-title {
    font-size: 1.05em;
    font-weight: 600;
    line-height: 1.35;
    flex: 1;
    min-width: 0;
  }

  .card-summary {
    font-size: 0.88em;
    opacity: 0.78;
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .magazine-item {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    min-height: 220px;
    margin-top: 4px;
  }

  .magazine-bg {
    width: 100%;
    height: 220px;
    object-fit: cover;
    display: block;
  }

  .magazine-placeholder {
    background: linear-gradient(
      135deg,
      var(--primary-color) 0%,
      rgba(0, 0, 0, 0.45) 100%
    );
    opacity: 0.55;
  }

  .magazine-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(transparent 20%, rgba(0, 0, 0, 0.82));
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 18px;
    color: #fff;
    gap: 6px;
  }

  .magazine-title {
    font-size: 1.15em;
    font-weight: 700;
    line-height: 1.3;
  }

  .magazine-summary {
    font-size: 0.85em;
    opacity: 0.9;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .magazine-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 2px;
  }

  .magazine-meta .meta,
  .magazine-meta .feed-name {
    color: rgba(255, 255, 255, 0.85);
    opacity: 1;
  }

  ha-card.preset-list {
    padding-top: 8px;
  }

  ha-card.preset-card {
    padding-left: 12px;
    padding-right: 12px;
  }

  ha-card.preset-magazine {
    padding-left: 12px;
    padding-right: 12px;
  }

  ha-card.preset-ticker .ticker-wrap {
    margin-top: 2px;
  }
`;
