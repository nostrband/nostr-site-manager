export const IconSeo = () => {
  // useEffect(() => {
  //   const handleLoad = () => {
  //     const body_tree = {
  //       id: "282:105",
  //       name: "SEO",
  //       type: "FRAME",
  //       deep_level: 0,
  //       locked: false,
  //       children: [
  //         {
  //           id: "282:109",
  //           name: "Vector",
  //           type: "VECTOR",
  //           deep_level: 1,
  //           locked: false,
  //           children: [],
  //           visible: true,
  //           p_id: "282:105",
  //           svg_node_id: "Vector",
  //           svg_node: {},
  //           transformOrigin: "center center",
  //           transform:
  //             "translate(0px, 0px) rotateX(-11.8628deg) rotateY(5.47819deg)",
  //         },
  //         {
  //           id: "282:110",
  //           name: "Vector_2",
  //           type: "VECTOR",
  //           deep_level: 1,
  //           locked: false,
  //           children: [],
  //           visible: true,
  //           p_id: "282:105",
  //           svg_node_id: "Vector_2",
  //           svg_node: {},
  //           transformOrigin: "center center",
  //           transform:
  //             "translate(-1.35625px, 0.269592px) rotateX(-11.8628deg) rotateY(5.47819deg)",
  //         },
  //       ],
  //       visible: true,
  //       svg_node_id: "SEO",
  //       svg_node: {},
  //     };
  //
  //     const icon = document.getElementById("icon-seo");
  //
  //     if (icon) {
  //       icon.addEventListener("mousemove", function (e) {
  //         MoveBackground(e, icon);
  //       });
  //
  //       icon.addEventListener("mouseleave", function (e) {
  //         body_tree.children.forEach((elemennt, index) => {
  //           const el = document.getElementById(elemennt.svg_node_id);
  //
  //           el.style.transformOrigin = elemennt.transformOrigin;
  //           el.style.transform = elemennt.transform;
  //           el.style.transition = ".3s";
  //         });
  //       });
  //     }
  //     function parseDigit(str) {
  //       const result = str.match(/(-?\d+(\.\d+)?)/g).map((v) => +v);
  //       return { tdeg: result[0], tox: result[1], toy: result[2] };
  //     }
  //     function MoveBackground(e, icon) {
  //       body_tree.children.forEach((elemennt, index) => {
  //         const el = document.getElementById(elemennt.svg_node_id);
  //         const iconReact = icon.getBoundingClientRect();
  //         if (elemennt.locked || !el) return;
  //         const ind = index;
  //         const i = ind;
  //         const offsetX =
  //           (e.clientX / window.innerWidth) * 30 * i * 0.4 - 15 * i * 0.4;
  //         const offsetY =
  //           (e.clientY / window.innerHeight) * 30 * i * 0.4 - 15 * i * 0.4;
  //         const transform = el
  //           ?.getAttribute("transform")
  //           ?.match(/rotate\(.*\)/);
  //
  //         const xOrigin =
  //           document.querySelector("body").getBoundingClientRect().width / 2;
  //         const yOrigin =
  //           document.querySelector("body").getBoundingClientRect().height / 2;
  //         console.log(iconReact)
  //         const yRot = ((e.clientX - xOrigin) / xOrigin) * -25;
  //         const xRot = ((e.clientY - yOrigin) / yOrigin) * 25;
  //         let { tdeg, tox, toy } = transform
  //           ? parseDigit(transform[0])
  //           : { tdeg: null, tox: null, toy: null };
  //         el.style.transformOrigin =
  //           transform && (tox || toy) ? `${tox}px, ${toy}px` : "center";
  //         el.style.transform =
  //           "translate(" +
  //           offsetX +
  //           "px," +
  //           offsetY +
  //           "px) " +
  //           (transform ? ` rotate(${tdeg}deg)` : "") +
  //           ` rotateX(${xRot}deg) rotateY(${yRot}deg)`;
  //         el.style.transition = "none";
  //       });
  //     }
  //   };
  //
  //   if (document.readyState === "complete") {
  //     handleLoad();
  //   } else {
  //     window.addEventListener("load", handleLoad);
  //
  //     return () => {
  //       window.removeEventListener("load", handleLoad);
  //     };
  //   }
  // }, []);

  return (
    <svg
      viewBox="0 0 126 126"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ height: "100%", width: "100%" }}
    >
      <g id="SEO">
        <path
          id="Vector"
          d="M63 9.84375C52.4867 9.84375 42.2095 12.9613 33.468 18.8022C24.7265 24.6431 17.9133 32.9449 13.8901 42.658C9.86678 52.371 8.81411 63.059 10.8652 73.3703C12.9162 83.6816 17.9788 93.1531 25.4129 100.587C32.8469 108.021 42.3184 113.084 52.6297 115.135C62.9411 117.186 73.629 116.133 83.342 112.11C93.0551 108.087 101.357 101.274 107.198 92.532C113.039 83.7905 116.156 73.5133 116.156 63C116.141 48.9069 110.535 35.3955 100.57 25.4301C90.6046 15.4648 77.0931 9.85938 63 9.84375ZM63 104.344C54.823 104.344 46.8296 101.919 40.0307 97.3761C33.2317 92.8332 27.9326 86.3761 24.8034 78.8216C21.6742 71.267 20.8554 62.9541 22.4507 54.9342C24.0459 46.9143 27.9835 39.5476 33.7656 33.7656C39.5476 27.9835 46.9144 24.0459 54.9343 22.4507C62.9542 20.8554 71.267 21.6741 78.8216 24.8034C86.3762 27.9326 92.8332 33.2317 97.3761 40.0306C101.919 46.8296 104.344 54.823 104.344 63C104.332 73.9614 99.9724 84.4706 92.2215 92.2215C84.4706 99.9724 73.9615 104.332 63 104.344ZM80.3595 37.8984L52.797 49.7109C51.4038 50.3083 50.2936 51.4185 49.6962 52.8117L37.8837 80.3742C37.427 81.4581 37.3043 82.6537 37.5314 83.8077C37.7585 84.9617 38.3249 86.0217 39.1582 86.8518C39.9914 87.6819 41.0536 88.2443 42.2085 88.4669C43.3634 88.6896 44.5584 88.5624 45.6406 88.1016L73.2031 76.2891C74.5963 75.6917 75.7065 74.5815 76.3038 73.1883L88.1163 45.6258C88.573 44.5419 88.6957 43.3463 88.4686 42.1923C88.2416 41.0383 87.6751 39.9783 86.8419 39.1482C86.0086 38.3181 84.9465 37.7557 83.7916 37.5331C82.6367 37.3104 81.4416 37.4376 80.3595 37.8984ZM66.3764 66.3912L54.5639 71.4558L59.6285 59.6433L71.441 54.5787L66.3764 66.3912Z"
          fill="#FF3ED9"
          fillOpacity="0.5"
          style={{
            transform:
              "translate(0px, 0px) rotateX(-11.8628deg) rotateY(5.47819deg)",
            transformOrigin: "center center",
          }}
        ></path>
        <path
          id="Vector_2"
          d="M63 9.84375C52.4867 9.84375 42.2095 12.9613 33.468 18.8022C24.7265 24.6431 17.9133 32.9449 13.8901 42.658C9.86678 52.371 8.81411 63.059 10.8652 73.3703C12.9162 83.6816 17.9788 93.1531 25.4129 100.587C32.8469 108.021 42.3184 113.084 52.6297 115.135C62.9411 117.186 73.629 116.133 83.342 112.11C93.0551 108.087 101.357 101.274 107.198 92.532C113.039 83.7905 116.156 73.5133 116.156 63C116.141 48.9069 110.535 35.3955 100.57 25.4301C90.6046 15.4648 77.0931 9.85938 63 9.84375ZM63 104.344C54.823 104.344 46.8296 101.919 40.0307 97.3761C33.2317 92.8332 27.9326 86.3761 24.8034 78.8216C21.6742 71.267 20.8554 62.9541 22.4507 54.9342C24.0459 46.9143 27.9835 39.5476 33.7656 33.7656C39.5476 27.9835 46.9144 24.0459 54.9343 22.4507C62.9542 20.8554 71.267 21.6741 78.8216 24.8034C86.3762 27.9326 92.8332 33.2317 97.3761 40.0306C101.919 46.8296 104.344 54.823 104.344 63C104.332 73.9614 99.9724 84.4706 92.2215 92.2215C84.4706 99.9724 73.9615 104.332 63 104.344ZM80.3595 37.8984L52.797 49.7109C51.4038 50.3083 50.2936 51.4185 49.6962 52.8117L37.8837 80.3742C37.427 81.4581 37.3043 82.6537 37.5314 83.8077C37.7585 84.9617 38.3249 86.0217 39.1582 86.8518C39.9914 87.6819 41.0536 88.2443 42.2085 88.4669C43.3634 88.6896 44.5584 88.5624 45.6406 88.1016L73.2031 76.2891C74.5963 75.6917 75.7065 74.5815 76.3038 73.1883L88.1163 45.6258C88.573 44.5419 88.6957 43.3463 88.4686 42.1923C88.2416 41.0383 87.6751 39.9783 86.8419 39.1482C86.0086 38.3181 84.9465 37.7557 83.7916 37.5331C82.6367 37.3104 81.4416 37.4376 80.3595 37.8984ZM66.3764 66.3912L54.5639 71.4558L59.6285 59.6433L71.441 54.5787L66.3764 66.3912Z"
          fill="#FF3ED9"
          style={{
            transform:
              "translate(-1.35625px, 0.269592px) rotateX(-11.8628deg) rotateY(5.47819deg)",
            transformOrigin: "center center",
          }}
        ></path>
      </g>
    </svg>
  );
};
