const { useState, useEffect, useRef } = React;

// Custom Cursor Component
const CustomCursor = () => {
    const cursorRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        const moveCursor = (e) => {
            cursor.style.top = `${e.clientY}px`;
            cursor.style.left = `${e.clientX}px`;
        };

        const growCursor = () => cursor.classList.add('grow');
        const shrinkCursor = () => cursor.classList.remove('grow');

        document.addEventListener('mousemove', moveCursor);
        document.querySelectorAll('a, button, .project-item').forEach(el => {
            el.addEventListener('mouseenter', growCursor);
            el.addEventListener('mouseleave', shrinkCursor);
        });

        return () => {
            document.removeEventListener('mousemove', moveCursor);
            document.querySelectorAll('a, button, .project-item').forEach(el => {
                el.removeEventListener('mouseenter', growCursor);
                el.removeEventListener('mouseleave', shrinkCursor);
            });
        };
    }, []);

    return React.createElement('div', { className: 'cursor hidden md:block', ref: cursorRef });
};

// Three.js Scene Component
const ThreeScene = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const THREE = window.THREE;
        if (!THREE || !containerRef.current) return;

        const container = containerRef.current;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a0a);
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });

        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        const group = new THREE.Group();
        scene.add(group);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        for (let i = 0; i < 15; i++) {
            const material = new THREE.MeshStandardMaterial({
                color: 0x1a1a1a,
                metalness: 0.1,
                roughness: 0.8
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            );
            mesh.scale.set(
                Math.random() * 2 + 3,
                Math.random() * 2 + 3,
                Math.random() * 0.5 + 0.5
            );
            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            group.add(mesh);
        }

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
        directionalLight.position.set(0, 1, 1);
        scene.add(directionalLight);

        camera.position.z = 8;

        const clock = new THREE.Clock();

        const animate = () => {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();
            group.rotation.x += delta * 0.05;
            group.rotation.y += delta * 0.05;
            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return React.createElement('div', { className: 'canvas-container', ref: containerRef });
};


// Navigation Component
const Navigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return React.createElement('header', { className: 'fixed top-0 left-0 right-0 z-50' },
        React.createElement('nav', { className: 'container mx-auto px-6 py-4 flex justify-between items-center' },
            React.createElement('div', { className: 'flex items-center space-x-4' },
                React.createElement('div', { className: 'w-24 h-8  flex items-center justify-center' },
                    React.createElement('span', { className: 'text-white font-bold text-lg' }, 'TheSocialKollab')
                ),
              
            ),
            React.createElement('div', { className: 'hidden md:flex space-x-6 items-center' },
                React.createElement('a', { href: '#', className: 'text-white' },
                    React.createElement('svg', { className: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg' },
                        React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })
                    )
                ),
                React.createElement('a', { href: '#', className: 'text-white' },
                     React.createElement('svg', { className: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg' },
                        React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M4 6h16M4 12h16M4 18h16' })
                    )
                )
            ),
            React.createElement('div', { className: 'md:hidden' },
                React.createElement('button', { onClick: () => setIsMenuOpen(!isMenuOpen), className: 'text-white focus:outline-none' },
                    React.createElement('svg', { className: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg' },
                        React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M4 6h16M4 12h16m-7 6h7' })
                    )
                )
            )
        )
    );
};

// Hero Component
const Hero = () => {
    return React.createElement('section', { id: 'hero', className: 'h-screen flex items-center justify-center text-white relative overflow-hidden' },
        React.createElement(ThreeScene),
        React.createElement('div', { className: 'text-center z-10' },
            React.createElement('h1', { className: 'text-5xl md:text-7xl font-light mb-12 max-w-4xl mx-auto' },
                'Built for brands that want to ',
                React.createElement('span', { style: { color: '#3c82f6' } }, 'grow'),
                ' instead of guess'
            ),
            React.createElement('div', { className: 'flex justify-center items-center space-x-6' },
                React.createElement('button', { className: 'bg-white/10 border border-white/20 backdrop-blur-md px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition' }, 'Plan a call'),
                React.createElement('span', { className: 'text-white/50' }, 'or'),
                React.createElement('button', { className: 'bg-white/10 border border-white/20 backdrop-blur-md px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition' }, 'View portfolio')
            )
        ),
       

// Projects Component
const Projects = () => {
    const { Motion, spring } = ReactMotion;
    const { useState } = React;
    const [currentIndex, setCurrentIndex] = useState(0);
    const projects = [
        {
            id: 1,
            title: 'KKAssociates',
            description: 'A MERN stack project with a professional Admin Panel.',
            image: './kkassociate.png',
            link: 'https://kkassociate.com/'
        },
        {
            id: 2,
            title: 'Sai Sneh Hospital',
            description: 'A modern hospital website with state-of-the-art facilities and responsive UI.',
            image: './saisnehhospital.png',
            link: 'https://saisneh-hospital-frontend.onrender.com/'
        },
        {
            id: 3,
            title: 'Ecommerce',
            description: 'A dynamic ecommerce platform with product listing, cart, and Try on feature.',
            image: './ecommerce.png',
            link: 'https://kaash-clothing-1.onrender.com/'
        },
        {
            id: 4,
            title: 'Futureal',
            description: 'A futuristic commercial hub website showcasing innovation and modern design.',
            image: './futureal.png',
            link: 'https://futureal.in/'
        },
        {
            id: 5,
            title: 'Ankur Associates',
            description: 'A 3d clean and responsive  website for a professional Architecture firm.',
            image: './ankurassociates.png',
            link: 'https://akassociates.onrender.com/'
        }
    ];

    const nextProject = () => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % projects.length);
    };

    const prevProject = () => {
        setCurrentIndex(prevIndex => (prevIndex - 1 + projects.length) % projects.length);
    };

    const currentProject = projects[currentIndex];

    return React.createElement('section', { id: 'projects', className: 'py-20 bg-gray-900 text-white' },
        React.createElement('div', { className: 'container mx-auto px-6' },
            React.createElement('div', { className: 'flex justify-between items-center mb-12' },
                React.createElement('h2', { className: 'text-4xl font-bold' }, 'Our Projects'),
                React.createElement('div', { className: 'md:hidden flex items-center gap-4' },
                    React.createElement('button', { onClick: prevProject, className: 'p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition' },
                        React.createElement('svg', { className: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg' },
                            React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M15 19l-7-7 7-7' })
                        )
                    ),
                    React.createElement('button', { onClick: nextProject, className: 'p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition' },
                        React.createElement('svg', { className: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg' },
                            React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M9 5l7 7-7 7' })
                        )
                    )
                )
            ),

            // Bento Grid for Desktop
            React.createElement('div', { className: 'hidden md:grid md:grid-cols-4 auto-rows-[250px] gap-4' },
                projects.map((project, index) => {
                    const bentoClasses = {
                        0: 'md:col-span-2 md:row-span-2',
                        1: 'md:col-span-2',
                        2: 'md:col-span-1',
                        3: 'md:col-span-1',
                        4: 'md:col-span-2'
                    };
                    const itemClass = bentoClasses[index] || 'md:col-span-1';
                    return React.createElement(Motion, {
                        key: project.id,
                        defaultStyle: { opacity: 0, y: 50 },
                        style: { opacity: spring(1), y: spring(0) }
                    },
                        (style) => React.createElement('div', {
                            className: `project-item bg-gray-800 rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300 cursor-pointer flex flex-col relative ${itemClass}`,
                            style: { opacity: style.opacity, transform: `translateY(${style.y}px)` },
                            onClick: () => window.open(project.link, '_blank')
                        },
                            React.createElement('img', { src: project.image, alt: project.title, className: 'w-full h-full object-cover' }),
                            React.createElement('div', { className: 'absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent' },
                                React.createElement('h3', { className: 'text-xl font-bold' }, project.title),
                                React.createElement('p', { className: 'text-gray-300 text-sm' }, project.description)
                            )
                        )
                    );
                })
            ),

            // Slider for Mobile
            React.createElement('div', { className: 'md:hidden' },
                React.createElement(Motion, {
                    key: currentProject.id,
                    defaultStyle: { opacity: 0, x: 50 },
                    style: { opacity: spring(1), x: spring(0) }
                },
                    (style) => React.createElement('div', {
                        className: 'project-item bg-gray-800 rounded-lg overflow-hidden shadow-2xl cursor-pointer relative h-[350px]',
                        style: { opacity: style.opacity, transform: `translateX(${style.x}px)` },
                        onClick: () => window.open(currentProject.link, '_blank')
                    },
                        React.createElement('img', { src: currentProject.image, alt: currentProject.title, className: 'w-full h-full object-cover' }),
                        React.createElement('div', { className: 'absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent' },
                            React.createElement('h3', { className: 'text-xl font-bold' }, currentProject.title),
                            React.createElement('p', { className: 'text-gray-300 text-sm' }, currentProject.description)
                        )
                    )
                )
            )
        )
    );
};

// About Component
const About = () => {
    return React.createElement('section', { id: 'about', className: 'py-20 bg-black text-white' },
        React.createElement('div', { className: 'container mx-auto px-6 flex flex-col md:flex-row items-center' },
            React.createElement('div', { className: 'md:w-1/2 mb-10 md:mb-0' },
                React.createElement('h2', { className: 'text-4xl font-bold mb-4' }, 'About Us'),
                React.createElement('p', { className: 'text-gray-400 mb-6' }, 'At TheSocialKollab, we blend creativity with technology to deliver impactful digital solutions. From stunning websites and intuitive UI/UX design to engaging photos, videos, and social media strategies — we help brands stand out and connect meaningfully. Our team specializes in web development and holistic brand strategy, ensuring every project speaks your vision loud and clear.'),
                React.createElement('button', { className: 'bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200' }, 'Learn More')
            ),
            React.createElement('div', { className: 'md:w-1/2 flex justify-center' },
              
            )
        )
    );
};

// Contact Component
const Contact = () => {
    return React.createElement('section', { id: 'contact', className: 'py-20 bg-gray-900 text-white' },
        React.createElement('div', { className: 'container mx-auto px-6 text-center' },
            React.createElement('h2', { className: 'text-4xl font-bold mb-4' }, 'Get in Touch'),
            React.createElement('p', { className: 'text-gray-400 mb-8 max-w-2xl mx-auto' }, 'Have a project in mind? We would love to hear from you. Fill out the form below, and we will get back to you as soon as possible.'),
            React.createElement('form', { className: 'max-w-xl mx-auto' },
                React.createElement('div', { className: 'flex flex-col md:flex-row gap-4 mb-4' },
                    React.createElement('input', { type: 'text', placeholder: 'Your Name', className: 'w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-white' }),
                    React.createElement('input', { type: 'email', placeholder: 'Your Email', className: 'w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-white' })
                ),
                React.createElement('textarea', { placeholder: 'Your Message', rows: '5', className: 'w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-white' }),
                React.createElement('button', { type: 'submit', className: 'bg-white text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-200 transition w-full' }, 'Send Message')
            )
        )
    );
};

// Footer Component
const Footer = () => {
    return React.createElement('footer', { className: 'bg-black py-6' },
        React.createElement('div', { className: 'container mx-auto px-6 text-center text-gray-500' },
            React.createElement('p', {}, '© 2024 TheSocialKollab. All Rights Reserved.')
        )
    );
};

// Main App Component
const App = () => {
    return React.createElement(React.Fragment, null,
        React.createElement(CustomCursor),
        React.createElement(Navigation),
        React.createElement('main', null,
            React.createElement(Hero),
            React.createElement(Projects),
            React.createElement(About),
            React.createElement(Contact)
        ),
        React.createElement(Footer)
    );
};

// Render the App
ReactDOM