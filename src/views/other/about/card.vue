<template>
    <div class="main">
        <div class="card">
            <div class="fl">
                <div class="fullscreen">
                    <svg viewBox="0 0 30 30" class="fullscreen_svg">
                        <path
                            d="M3.563-.004a3.573 3.573 0 0 0-3.527 4.09l-.004-.02v28.141c0 1.973 1.602 3.57 3.57 3.57s3.57-1.598 3.57-3.57V12.218v.004l22.461 22.461a3.571 3.571 0 0 0 6.093-2.527c0-.988-.398-1.879-1.047-2.523L12.218 7.172h19.989c1.973 0 3.57-1.602 3.57-3.57s-1.598-3.57-3.57-3.57H4.035a3.008 3.008 0 0 0-.473-.035zM96.333 0l-.398.035.02-.004h-28.16a3.569 3.569 0 0 0-3.57 3.57 3.569 3.569 0 0 0 3.57 3.57h19.989L65.323 29.632a3.555 3.555 0 0 0-1.047 2.523 3.571 3.571 0 0 0 6.093 2.527L92.83 12.221v19.985a3.569 3.569 0 0 0 3.57 3.57 3.569 3.569 0 0 0 3.57-3.57V4.034v.004a3.569 3.569 0 0 0-3.539-4.043l-.105.004zM3.548 64.23A3.573 3.573 0 0 0 .029 67.8v28.626-.004l.016.305-.004-.016.004.059v-.012l.039.289-.004-.023.023.121-.004-.023c.074.348.191.656.34.938l-.008-.02.055.098-.008-.02.148.242-.008-.012.055.082-.008-.012c.199.285.43.531.688.742l.008.008.031.027.004.004c.582.461 1.32.742 2.121.762h.004l.078.004h28.61a3.569 3.569 0 0 0 3.57-3.57 3.569 3.569 0 0 0-3.57-3.57H12.224l22.461-22.461a3.569 3.569 0 0 0-2.492-6.125l-.105.004h.008a3.562 3.562 0 0 0-2.453 1.074L7.182 87.778V67.793a3.571 3.571 0 0 0-3.57-3.57h-.055.004zm92.805 0a3.573 3.573 0 0 0-3.519 3.57v19.993-.004L70.373 65.328a3.553 3.553 0 0 0-2.559-1.082h-.004a3.573 3.573 0 0 0-3.566 3.57c0 1.004.414 1.91 1.082 2.555l22.461 22.461H67.802a3.57 3.57 0 1 0 0 7.14h28.606c.375 0 .742-.059 1.082-.168l-.023.008.027-.012-.02.008.352-.129-.023.008.039-.02-.02.008.32-.156-.02.008.023-.016-.008.008c.184-.102.34-.207.488-.32l-.008.008.137-.113-.008.004.223-.211.008-.008c.156-.164.301-.34.422-.535l.008-.016-.008.016.008-.02.164-.285.008-.02-.008.016.008-.02c.098-.188.184-.406.246-.633l.008-.023-.004.008.008-.023a3.44 3.44 0 0 0 .121-.852v-.004l.004-.078V67.804a3.569 3.569 0 0 0-3.57-3.57h-.055.004z">
                        </path>
                    </svg>
                </div>
            </div>
            <div class="card_content">
                <label class="switch_738">
                    <input type="checkbox" class="chk_738">
                    {{ content }}
                </label>

            </div>
            <div class="card_back"></div>
        </div>
        <div class="data">
            <div class="img">
                <img :src="avatar" style="width: 100%; height: 100%;" />
            </div>
            <div class="text">
                <div class="text_m">{{ author }}</div>
                <div class="text_s">author</div>
            </div>
        </div>
        <div class="btns">

            <div class="likes">
                <a :href="contact.github" target="_blank">
                    <svg t="1720796346257" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="4241" width="20" height="20">
                        <path
                            d="M512 42.666667A464.64 464.64 0 0 0 42.666667 502.186667 460.373333 460.373333 0 0 0 363.52 938.666667c23.466667 4.266667 32-9.813333 32-22.186667v-78.08c-130.56 27.733333-158.293333-61.44-158.293333-61.44a122.026667 122.026667 0 0 0-52.053334-67.413333c-42.666667-28.16 3.413333-27.733333 3.413334-27.733334a98.56 98.56 0 0 1 71.68 47.36 101.12 101.12 0 0 0 136.533333 37.973334 99.413333 99.413333 0 0 1 29.866667-61.44c-104.106667-11.52-213.333333-50.773333-213.333334-226.986667a177.066667 177.066667 0 0 1 47.36-124.16 161.28 161.28 0 0 1 4.693334-121.173333s39.68-12.373333 128 46.933333a455.68 455.68 0 0 1 234.666666 0c89.6-59.306667 128-46.933333 128-46.933333a161.28 161.28 0 0 1 4.693334 121.173333A177.066667 177.066667 0 0 1 810.666667 477.866667c0 176.64-110.08 215.466667-213.333334 226.986666a106.666667 106.666667 0 0 1 32 85.333334v125.866666c0 14.933333 8.533333 26.88 32 22.186667A460.8 460.8 0 0 0 981.333333 502.186667 464.64 464.64 0 0 0 512 42.666667"
                            fill="white" p-id="4242"></path>
                    </svg>
                </a>
            </div>

            <div class="comments">
                <a :href="contact.gitee" target="_blank">
                    <svg t="1720797592466" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="5544" id="mx_n_1720797592467" width="18" height="18">
                        <path
                            d="M512 1024C229.248 1024 0 794.752 0 512S229.248 0 512 0s512 229.248 512 512-229.248 512-512 512z m259.168-568.896h-290.752a25.28 25.28 0 0 0-25.28 25.28l-0.032 63.232c0 13.952 11.296 25.28 25.28 25.28h177.024a25.28 25.28 0 0 1 25.28 25.28v12.64a75.84 75.84 0 0 1-75.84 75.84h-240.224a25.28 25.28 0 0 1-25.28-25.28v-240.192a75.84 75.84 0 0 1 75.84-75.84h353.92a25.28 25.28 0 0 0 25.28-25.28l0.064-63.2a25.312 25.312 0 0 0-25.28-25.312H417.184a189.632 189.632 0 0 0-189.632 189.6v353.952c0 13.952 11.328 25.28 25.28 25.28h372.928a170.656 170.656 0 0 0 170.656-170.656v-145.376a25.28 25.28 0 0 0-25.28-25.28z"
                            p-id="5545" fill="#ffffff"></path>
                    </svg>
                </a>
            </div>

            <div class="views">
                <a :href="contact.qq" target="_blank">
                    <svg t="1720800651016" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="6767" width="20" height="20">
                        <path
                            d="M871.2 584.2c-14.2-33.9-33.1-64-52.6-86.8 7.6-11.3 12.3-27.2 12.3-44.9 0-23.8-8.6-44.5-21.2-55 2.6-15.3 4-31 4-47 0-157.9-131.6-285.9-294-285.9-162.3 0-293.9 128-293.9 285.9 0 9.2 0.5 18.2 1.3 27.2-13.2 10.1-22.3 31.3-22.3 55.8 0 20.9 6.7 39.4 16.8 50.7-21.5 20.9-42.9 49.3-60 82.7-41.7 81.4-35.5 163.7-9.8 177.1 13.2 6.9 47.5-14.7 81.2-54.8 5.5 47.1 28.2 90.2 63.1 124.8-57.7 16.7-95.9 49.7-90.8 83.2 6.4 42.3 79.4 69.5 163.2 60.6 61.3-6.5 111.4-30.5 131.3-59.5 5.1 0.2 10.3 0.4 15.5 0.4 9 0 17.8-0.4 26.6-1 21.3 27.6 68.4 50.6 125.3 57.7 81.3 10.1 151.6-15.9 157-58.1 4.3-33.3-32.9-66.7-88.5-84.4 32.7-32.9 54.5-73.3 61.1-117.5 29.9 40.1 60.6 65.8 76.6 62.3 18.9-4.1 32.4-90.6-2.2-173.5z"
                            fill="#ffffff" p-id="6768"></path>
                    </svg>
                </a>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

defineProps(['avatar', 'author', 'content', 'contact'])

</script>

<style>
.main {
    position: relative;
}

.card {
    width: 15em;
    height: 10em;
    background-color: #252525;
    border-radius: 7px;
    cursor: pointer;
}

.fl {
    display: flex;
    justify-content: flex-end;
    opacity: 0;
    transition: .2s ease-in-out;
}

.fl:hover .fullscreen {
    scale: 1.2;
}

.fl:hover .fullscreen_svg {
    fill: white;
}

.fullscreen {
    width: 1.5em;
    height: 1.5em;
    border-radius: 5px;
    background-color: #727890;
    margin: 1em;
    margin-right: 0.5em;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: .2s ease-in-out;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, .4);
}

.fullscreen_svg {
    width: 10px;
    height: 10px;
    fill: rgb(177, 176, 176);
    transition: .2s ease-in-out;
}

.card_back {
    position: relative;
    width: 15em;
    height: 13em;
    background-color: rgba(30, 31, 38, 0.575);
    border-radius: 7px;
    margin-top: -5em;
    margin-left: 0.7em;
    transition: .2s ease-in-out;
    z-index: -1;
}

.main:hover .card_back {
    margin-top: -6.25em;
    margin-left: 0em;
    scale: 1.1;
    height: 15.25em;
    cursor: pointer;
}

.main:hover .fl {
    opacity: 1;
    cursor: pointer;
    margin-right: 0.5em;
}

.data {
    display: flex;
    flex-direction: row;
    margin-top: 1em;
}

.img {
    width: 2.25em;
    height: 2.25em;
    background-color: #252525;
    border-radius: 5px;
    overflow: hidden;
}

.text {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-left: 0.5em;
    font-family: Montserrat;
    color: white;
}

.text_m {
    font-weight: bold;
    font-size: 0.9em;
}

.text_s {
    font-size: 0.7em;
}

.btns {
    display: flex;
    gap: 0.5em;
    transition: .2s ease-in-out;
}

.likes {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5em;
    height: 1.5em;
    border-radius: 4px;
    margin-top: -0.5em;
    opacity: 0;
    background-color: #444857;
    transition: .2s ease-in-out;
}

.likes_text {
    font-family: Montserrat;
    font-size: 0.8em;
    margin-left: 0.25em;
    color: white;
}

.likes_svg {
    width: 12px;
    height: 12px;
    fill: white;
}

.likes:hover {
    background-color: #5A5F73;
    cursor: pointer;
}

.comments {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5em;
    height: 1.5em;
    border-radius: 4px;
    margin-top: -0.5em;
    opacity: 0;
    background-color: #444857;
    transition: .24s ease-in-out;
}

.comments_text {
    font-family: Montserrat;
    font-size: 0.8em;
    margin-left: 0.25em;
    color: white;
}

.comments_svg {
    width: 12px;
    height: 12px;
    fill: white;
}

.comments:hover {
    background-color: #5A5F73;
    cursor: pointer;
}

.views {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3em;
    height: 1.5em;
    border-radius: 4px;
    margin-top: -0.5em;
    opacity: 0;
    background-color: #444857;
    transition: .28s ease-in-out;
}

.views_text {
    font-family: Montserrat;
    font-size: 0.8em;
    margin-left: 0.25em;
    color: white;
}

.views_svg {
    width: 12px;
    height: 12px;
    fill: white;
}

.views:hover {
    background-color: #5A5F73;
    cursor: pointer;
}

.main:hover .likes {
    margin-top: 0.5em;
    opacity: 1;
}

.main:hover .comments {
    margin-top: 0.5em;
    opacity: 1;
}

.main:hover .views {
    margin-top: 0.5em;
    opacity: 1;
}



/* The Main Switch */

.card_content {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0px 10px;
    margin-top: -15px;
    line-height: 1.2rem;
}

/* The switch - the box around the slider */
.switch_738 {
    font-size: 13px;
    position: relative;
    display: inline-block;
    width: 100%;
    height: 100%;
    color: white;
}

/* Hide default HTML checkbox */
.switch_738 .chk_738 {
    opacity: 0;
    width: 0;
    height: 0;
}

/* The slider */
.slider_738 {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 5px;
}

.slider_738:before {
    position: absolute;
    content: "";
    height: .5em;
    width: 2.4em;
    border-radius: 5px;
    left: -0.6em;
    top: 0.2em;
    background-color: white;
    box-shadow: 0 6px 7px rgba(0, 0, 0, 0.3);
    transition: .4s;
}

.slider_738:before,
.slider_738:after {
    content: "";
    display: block;
}

.slider_738:after {
    background: linear-gradient(transparent 50%, rgba(255, 255, 255, 0.15) 0) 0 50% / 50% 100%,
        repeating-linear-gradient(90deg, rgb(255, 255, 255) 0, rgb(255, 255, 255), rgb(255, 255, 255) 20%, rgb(255, 255, 255) 20%, rgb(255, 255, 255) 40%) 0 50% / 50% 100%,
        radial-gradient(circle at 50% 50%, rgb(255, 255, 255) 25%, transparent 26%);
    background-repeat: no-repeat;
    border: 0.25em solid transparent;
    border-left: 0.4em solid #ffffff;
    border-right: 0 solid transparent;
    transition: border-left-color 0.1s 0.3s ease-out, transform 0.3s ease-out;
    transform: translateX(-22.5%) rotate(90deg);
    transform-origin: 25% 50%;
    position: relative;
    top: 0.5em;
    left: 0.55em;
    width: 2em;
    height: 1em;
    box-sizing: border-box;
}

.chk_738:checked+.slider_738 {
    background-color: limegreen;
}

.chk_738:focus+.slider_738 {
    box-shadow: 0 0 1px limegreen;
}

.chk_738:checked+.slider_738:before {
    transform: translateY(2.3em);
}

.chk_738:checked+.slider_738:after {
    transform: rotateZ(90deg) rotateY(180deg) translateY(0.45em) translateX(-1.4em);
}
</style>