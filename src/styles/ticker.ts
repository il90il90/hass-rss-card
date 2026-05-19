import { css } from 'lit';

export const tickerStyles = css`
  .ticker-wrap {
    overflow: hidden;
    width: 100%;
    mask-image: linear-gradient(
      to right,
      transparent,
      black 5%,
      black 95%,
      transparent
    );
  }

  [dir='rtl'] .ticker-wrap {
    mask-image: linear-gradient(
      to left,
      transparent,
      black 5%,
      black 95%,
      transparent
    );
  }

  .ticker-track {
    display: flex;
    width: max-content;
    gap: 32px;
    animation: ticker-scroll var(--ticker-duration, 30s) linear infinite;
  }

  .ticker-track.paused {
    animation-play-state: paused;
  }

  .ticker-track.no-animation {
    animation: none;
  }

  @keyframes ticker-scroll {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }

  [dir='rtl'] .ticker-track {
    animation-name: ticker-scroll-rtl;
  }

  @keyframes ticker-scroll-rtl {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(50%);
    }
  }

  .ticker-item {
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .ticker-separator {
    opacity: 0.4;
    margin-inline: 8px;
  }

  .ticker-title {
    font-size: 0.95em;
    font-weight: 500;
  }

  .ticker-item .item-image.size-small,
  .ticker-item .placeholder-image.size-small {
    width: 28px;
    height: 28px;
  }

  .ticker-wrap.ticker-single {
    mask-image: none;
    padding: 4px 0;
  }

  .ticker-single .ticker-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    min-width: 0;
    animation: ticker-fade-in 0.45s ease;
  }

  .ticker-single .ticker-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ticker-single .feed-name {
    font-size: 0.7em;
    opacity: 0.5;
    text-align: end;
    margin-top: 2px;
  }

  @keyframes ticker-fade-in {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
