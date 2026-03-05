html:
```html
<div class="ai-container-wrapper">
  <div class="main-heading">What can I help with?</div>
  <div class="ai-container">
    <input type="text" class="ai-input" placeholder="Ask anything" />

    <div class="button-group">
      <div class="suggest-btn-wrapper">
        <label for="toggle-suggestions" class="ai-button suggest">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            height="24"
            width="24"
          >
            <path
              fill="currentColor"
              d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9851 4.00291C11.9933 4.00046 11.9982 4.00006 11.9996 4C12.001 4.00006 12.0067 4.00046 12.0149 4.00291C12.0256 4.00615 12.047 4.01416 12.079 4.03356C12.2092 4.11248 12.4258 4.32444 12.675 4.77696C12.9161 5.21453 13.1479 5.8046 13.3486 6.53263C13.6852 7.75315 13.9156 9.29169 13.981 11H10.019C10.0844 9.29169 10.3148 7.75315 10.6514 6.53263C10.8521 5.8046 11.0839 5.21453 11.325 4.77696C11.5742 4.32444 11.7908 4.11248 11.921 4.03356C11.953 4.01416 11.9744 4.00615 11.9851 4.00291ZM8.01766 11C8.08396 9.13314 8.33431 7.41167 8.72334 6.00094C8.87366 5.45584 9.04762 4.94639 9.24523 4.48694C6.48462 5.49946 4.43722 7.9901 4.06189 11H8.01766ZM4.06189 13H8.01766C8.09487 15.1737 8.42177 17.1555 8.93 18.6802C9.02641 18.9694 9.13134 19.2483 9.24522 19.5131C6.48461 18.5005 4.43722 16.0099 4.06189 13ZM10.019 13H13.981C13.9045 14.9972 13.6027 16.7574 13.1726 18.0477C12.9206 18.8038 12.6425 19.3436 12.3823 19.6737C12.2545 19.8359 12.1506 19.9225 12.0814 19.9649C12.0485 19.9852 12.0264 19.9935 12.0153 19.9969C12.0049 20.0001 11.9999 20 11.9999 20C11.9999 20 11.9948 20 11.9847 19.9969C11.9736 19.9935 11.9515 19.9852 11.9186 19.9649C11.8494 19.9225 11.7455 19.8359 11.6177 19.6737C11.3575 19.3436 11.0794 18.8038 10.8274 18.0477C10.3973 16.7574 10.0955 14.9972 10.019 13ZM15.9823 13C15.9051 15.1737 15.5782 17.1555 15.07 18.6802C14.9736 18.9694 14.8687 19.2483 14.7548 19.5131C17.5154 18.5005 19.5628 16.0099 19.9381 13H15.9823ZM19.9381 11C19.5628 7.99009 17.5154 5.49946 14.7548 4.48694C14.9524 4.94639 15.1263 5.45584 15.2767 6.00094C15.6657 7.41167 15.916 9.13314 15.9823 11H19.9381Z"
              clip-rule="evenodd"
              fill-rule="evenodd"
            ></path>
          </svg>
          <span class="search-text">Search</span>
        </label>
      </div>
      <div class="option-group">
        <input type="file" id="voice-input" accept="audio/*" capture="" />
        <label for="voice-input" class="ai-button voice">
          <svg
            style="height:24px;width:24px;"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="ai-icon"
          >
            <path
              d="M9.5 4C8.67157 4 8 4.67157 8 5.5V18.5C8 19.3284 8.67157 20 9.5 20C10.3284 20 11 19.3284 11 18.5V5.5C11 4.67157 10.3284 4 9.5 4Z"
              fill="currentColor"
              class="bar bar-1"
            ></path>
            <path
              d="M13 8.5C13 7.67157 13.6716 7 14.5 7C15.3284 7 16 7.67157 16 8.5V15.5C16 16.3284 15.3284 17 14.5 17C13.6716 17 13 16.3284 13 15.5V8.5Z"
              fill="currentColor"
              class="bar bar-2"
            ></path>
            <path
              d="M4.5 9C3.67157 9 3 9.67157 3 10.5V13.5C3 14.3284 3.67157 15 4.5 15C5.32843 15 6 14.3284 6 13.5V10.5C6 9.67157 5.32843 9 4.5 9Z"
              fill="currentColor"
              class="bar bar-3"
            ></path>
            <path
              d="M19.5 9C18.6716 9 18 9.67157 18 10.5V13.5C18 14.3284 18.6716 15 19.5 15C20.3284 15 21 14.3284 21 13.5V10.5C21 9.67157 20.3284 9 19.5 9Z"
              fill="currentColor"
              class="bar bar-4"
            ></path>
          </svg>
        </label>

        <input type="file" id="image-input" accept="image/*" />
        <label for="image-input" class="ai-button image">
          <svg
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            style="height:20px;width:20px"
            xmlns="http://www.w3.org/2000/svg"
            class="ai-icon"
          >
            <path
              clip-rule="evenodd"
              d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.219a.75.75 0 0 0-1.06 0l-1.91 1.909.47.47a.75.75 0 1 1-1.06 1.06L6.53 8.091a.75.75 0 0 0-1.06 0l-2.97 2.97ZM12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
              fill-rule="evenodd"
            ></path>
          </svg>
        </label>

        <input
          type="file"
          id="camera-input"
          accept="image/*"
          capture="environment"
        />
        <label for="camera-input" class="ai-button camera">
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            style="height:20px;width:20px;"
            xmlns="http://www.w3.org/2000/svg"
            class="ai-icon"
          >
            <path
              clip-rule="evenodd"
              d="M1 8a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 8.07 3h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 16.07 6H17a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8Zm13.5 3a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM10 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              fill-rule="evenodd"
            ></path>
          </svg>
        </label>
        <button type="button" class="ai-button submit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
            style="height:16px;width:16px;"
            class="ai-icon"
          >
            <path
              fill-rule="evenodd"
              d="M5 4a.75.75 0 0 1 .738.616l.252 1.388A1.25 1.25 0 0 0 6.996 7.01l1.388.252a.75.75 0 0 1 0 1.476l-1.388.252A1.25 1.25 0 0 0 5.99 9.996l-.252 1.388a.75.75 0 0 1-1.476 0L4.01 9.996A1.25 1.25 0 0 0 3.004 8.99l-1.388-.252a.75.75 0 0 1 0-1.476l1.388-.252A1.25 1.25 0 0 0 4.01 6.004l.252-1.388A.75.75 0 0 1 5 4ZM12 1a.75.75 0 0 1 .721.544l.195.682c.118.415.443.74.858.858l.682.195a.75.75 0 0 1 0 1.442l-.682.195a1.25 1.25 0 0 0-.858.858l-.195.682a.75.75 0 0 1-1.442 0l-.195-.682a1.25 1.25 0 0 0-.858-.858l-.682-.195a.75.75 0 0 1 0-1.442l.682-.195a1.25 1.25 0 0 0 .858-.858l.195-.682A.75.75 0 0 1 12 1ZM10 11a.75.75 0 0 1 .728.568.968.968 0 0 0 .704.704.75.75 0 0 1 0 1.456.968.968 0 0 0-.704.704.75.75 0 0 1-1.456 0 .968.968 0 0 0-.704-.704.75.75 0 0 1 0-1.456.968.968 0 0 0 .704-.704A.75.75 0 0 1 10 11Z"
              clip-rule="evenodd"
            ></path>
          </svg>
          Generate
        </button>
      </div>
    </div>

    <input type="checkbox" id="toggle-suggestions" />
    <div class="suggestion-panel">
      <div class="suggestion-item">What is the weather today?</div>
      <div class="suggestion-item">Tell me a joke.</div>
      <div class="suggestion-item">How do I code in JavaScript?</div>
    </div>
  </div>
</div>
```

css:
```css
.ai-container-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  width: calc(100% - 30px);
  font-family: poppins;
}
.main-heading {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 24px;
  color: #000000;
}
.ai-container {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  background: #fff;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  flex-shrink: 0;
}
/* Input Field */
.ai-input {
  width: 100%;
  padding: 10px 0px;
  border: 0px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;
}
.ai-input:focus {
  border-color: #007bff;
}
/* Button Group */
.button-group,
.option-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.option-group {
  column-gap: 8px;
}
.button-group {
  justify-content: space-between;
}
.ai-button {
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 4px;
  background: #000000;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 10px;
  font-size: 12px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
  text-align: center;
  text-decoration: none;
}
.ai-button:hover {
  background: #46484b;
  transform: scale(1.05);
}
.ai-button:focus {
  background: #232426;
  transform: scale(0.9);
}
.ai-button:active {
  transform: scale(0.95);
}
/* Variants for Suggest */
.search-text {
  width: 0px;
  overflow: hidden;
  transition: width 0.2s ease-in-out;
}
.ai-button.suggest {
  position: relative;
  z-index: 99999;
  padding: 4px;
  column-gap: 0px;
  border-radius: 30px;
  background: #0084ff;
  overflow: hidden;
}
.ai-button.suggest:hover {
  background: hsl(209, 100%, 31%);
}
.ai-button.suggest:hover .search-text {
  width: 100%;
  transition: width 0.2s ease-in-out;
}
.suggest-btn-wrapper {
  display: inline-block;
  position: relative;
  overflow: hidden;
  z-index: 99;
  padding: 3px;
  border-radius: 30px;
}
.suggest-btn-wrapper:before {
  animation: Button_rotate-gradient 5s linear infinite;
}
.suggest-btn-wrapper:before {
  content: "";
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  background: conic-gradient(
    from 4.67deg at 50% 50%,
    hsla(0, 0%, 100%, 0) -28.51deg,
    #0084ff 0.63deg,
    hsla(0, 0%, 100%, 0.22) 17.41deg,
    hsla(0, 0%, 100%, 0) 38.09deg,
    hsla(0, 0%, 100%, 0.24) 105.14deg,
    hsla(0, 0%, 100%, 0) 170.34deg,
    #0084ff 189.44deg,
    hsla(0, 0%, 100%, 0.08) 208.21deg,
    hsla(0, 0%, 100%, 0.43) 267.69deg,
    hsla(0, 0%, 100%, 0) 331.49deg,
    #0084ff 360.63deg
  );
  transform: scaleX(4);
  z-index: 111;
}
@keyframes Button_rotate-gradient {
  0% {
    transform: scale(9, 3) rotate(0);
  }

  50% {
    transform: scale(9, 3) rotate(180deg);
  }

  99.9999% {
    transform: scale(9, 3) rotate(1turn);
  }

  to {
    transform: scale(9, 3) rotate(0);
  }
}
/* Variants for Additional Options */
.ai-button.voice,
.ai-button.image,
.ai-button.camera {
  justify-content: center;
  border-radius: 50%;
  height: 30px;
  width: 30px;
}
.ai-icon {
  flex-shrink: 0;
}
.ai-button.voice {
  background: #6f42c1;
}
.ai-button.voice:hover {
  background: #5936a2;
}
.bar {
  transform-origin: center;
}

@keyframes wave {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.8);
  }
}

@keyframes wave2 {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.4);
  }
}

@keyframes wave3 {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.6);
  }
}

@keyframes wave4 {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.3);
  }
}

.ai-icon:hover .bar-1,
.ai-icon:focus .bar-1 {
  animation: wave 0.6s infinite ease-in-out alternate;
}

.ai-icon:hover .bar-2,
.ai-icon:focus .bar-2 {
  animation: wave2 0.6s infinite ease-in-out alternate;
}

.ai-icon:hover .bar-3,
.ai-icon:focus .bar-3 {
  animation: wave3 0.6s infinite ease-in-out alternate;
}

.ai-icon:hover .bar-4,
.ai-icon:focus .bar-4 {
  animation: wave4 0.6s infinite ease-in-out alternate;
}
.ai-button.image {
  background: #fd7e14;
}
.ai-button.image:hover {
  background: #e06d0f;
}
.ai-button.camera {
  background: rgb(32, 201, 151);
}
.ai-button.camera:hover {
  background: #1aa383;
}
/* Hidden Inputs for File and Toggle */
#toggle-suggestions,
#voice-input,
#image-input,
#camera-input {
  display: none;
}
/* Suggestion Panel Animation */
.suggestion-panel {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  padding: 0 10px;
  background: #e9ecef;
  border-radius: 20px;
  font-size: 14px;
  max-height: 0;
  overflow: hidden;
  transition:
    max-height 0.5s ease,
    padding 0.5s ease;
}
/* Expand Suggestion Panel When Toggled */
#toggle-suggestions:checked + .suggestion-panel {
  max-height: 300px;
  padding: 20px;
}
.suggestion-item {
  background: #fff;
  padding: 8px;
  border-radius: 20px;
  transition: background 0.3s;
  cursor: pointer;
}
.suggestion-item:hover {
  background: #f1f1f1;
}
```