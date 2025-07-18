function create3DRegionalChart() {
    const data = [
        {region: "东部地区", revenue: 141750, growth: 7.8},
        {region: "中部地区", revenue: 28726, growth: 7.3},
        {region: "西部地区", revenue: 18462, growth: 2.6},
        {region: "东北地区", revenue: 2485, growth: 1.8}
    ];

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 300 / 300, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(300, 300);
    document.getElementById("3d-chart").appendChild(renderer.domElement);

    const morandiColors = [0xB1A394, 0xD5C0A1, 0xA6A69F, 0x8C9F77];

    data.forEach((item, index) => {
        const geometry = new THREE.BoxGeometry(1, item.revenue / 5000, 1);
        const material = new THREE.MeshBasicMaterial({color: morandiColors[index]});
        const cube = new THREE.Mesh(geometry, material);
        cube.position.x = index * 2 - 3;
        scene.add(cube);
    });

    camera.position.z = 10;
    renderer.render(scene, camera);
}

create3DRegionalChart();
