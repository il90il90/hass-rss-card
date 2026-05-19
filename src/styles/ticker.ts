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
`;
