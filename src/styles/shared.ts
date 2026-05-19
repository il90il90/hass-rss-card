import { css } from 'lit';

export const cardStyles = css`
  :host {
    display: block;
  }

  ha-card {
    overflow: hidden;
    padding: 12px 16px;
    position: relative;
  }

  ha-card.loading {
    opacity: 0.7;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    gap: 8px;
  }

  .header-left {
    flex: 1;
    min-width: 0;
  }

  .header-title {
    font-size: 0.85em;
    font-weight: 500;
    opacity: 0.7;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .source-label {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    font-size: 0.85em;
    font-weight: 500;
    opacity: 0.85;
  }

  .source-select {
    flex: 1;
    min-width: 0;
    max-width: 100%;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    border-radius: 6px;
    background: var(--card-background-color, var(--ha-card-background, white));
    color: inherit;
    font: inherit;
    padding: 4px 8px;
    cursor: pointer;
  }

  .source-select:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .last-updated {
    font-size: 0.75em;
    opacity: 0.6;
    margin-bottom: 8px;
  }

  .refresh-btn {
    cursor: pointer;
    opacity: 0.7;
    border: none;
    background: none;
    color: inherit;
    padding: 4px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .refresh-btn:hover {
    opacity: 1;
    background: var(--divider-color, rgba(0, 0, 0, 0.08));
  }

  .refresh-btn.spinning ha-icon {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .error {
    color: var(--error-color, #db4437);
    font-size: 0.9em;
    padding: 8px 0;
  }

  .empty {
    opacity: 0.6;
    font-size: 0.9em;
    padding: 8px 0;
  }

  .new-badge {
    display: inline-block;
    font-size: 0.65em;
    font-weight: 700;
    text-transform: uppercase;
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    padding: 2px 6px;
    border-radius: 4px;
    margin-inline-end: 6px;
    vertical-align: middle;
    line-height: 1.4;
  }

  .item.read {
    opacity: 0.55;
  }

  .item-link {
    color: inherit;
    text-decoration: none;
    cursor: pointer;
  }

  .item-link:hover {
    text-decoration: underline;
  }

  .meta {
    font-size: 0.75em;
    opacity: 0.6;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .feed-name {
    font-size: 0.7em;
    opacity: 0.5;
  }
`;

export const imageStyles = css`
  .item-image {
    object-fit: cover;
    border-radius: 6px;
    flex-shrink: 0;
    background: var(--divider-color, rgba(0, 0, 0, 0.08));
  }

  .item-image.size-small {
    width: 32px;
    height: 32px;
  }

  .item-image.size-medium {
    width: 64px;
    height: 64px;
  }

  .item-image.size-large {
    width: 96px;
    height: 96px;
  }

  .item-image.fit-contain {
    object-fit: contain;
  }

  .item-image.hidden {
    display: none;
  }

  .placeholder-image {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--divider-color, rgba(0, 0, 0, 0.08));
    border-radius: 6px;
    flex-shrink: 0;
    opacity: 0.5;
  }

  .placeholder-image.size-small {
    width: 32px;
    height: 32px;
  }

  .placeholder-image.size-medium {
    width: 64px;
    height: 64px;
  }

  .placeholder-image.size-large {
    width: 96px;
    height: 96px;
  }
`;
