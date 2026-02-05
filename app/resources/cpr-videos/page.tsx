'use client';

import Link from 'next/link';

interface CPRVideo {
    title: string;
    titleTamil: string;
    description: string;
    descriptionTamil: string;
    youtubeId: string;
    duration: string;
    category: 'adult' | 'child' | 'infant';
}

const cprVideos: CPRVideo[] = [
    {
        title: 'CPR for Adults - Step by Step Guide',
        titleTamil: 'வயதுவந்தோருக்கு CPR - படிப்படியான வழிகாட்டி',
        description: 'Learn proper CPR technique for adults. Covers chest compressions and rescue breathing.',
        descriptionTamil: 'வயதுவந்தோருக்கு சரியான CPR நுட்பத்தை கற்றுக்கொள்ளுங்கள். மார்பு அழுத்தங்கள் மற்றும் மீட்பு சுவாசத்தை உள்ளடக்கியது.',
        youtubeId: 'kPJVHD5eZ3k',
        duration: '5:30',
        category: 'adult'
    },
    {
        title: 'Hands-Only CPR Training',
        titleTamil: 'கைகள் மட்டும் CPR பயிற்சி',
        description: 'Simplified CPR without rescue breaths - ideal for bystanders with no medical training.',
        descriptionTamil: 'மீட்பு மூச்சுகள் இல்லாமல் எளிமைபடுத்தப்பட்ட CPR - மருத்துவ பயிற்சி இல்லாத பார்வையாளர்களுக்கு சிறந்தது.',
        youtubeId: 'n5hP4DIBCEE',
        duration: '3:45',
        category: 'adult'
    },
    {
        title: 'CPR for Children (1-8 years)',
        titleTamil: 'குழந்தைகளுக்கு CPR (1-8 வயது)',
        description: 'Modified CPR technique for children. Important differences from adult CPR.',
        descriptionTamil: 'குழந்தைகளுக்கு மாற்றியமைக்கப்பட்ட CPR நுட்பம். வயதுவந்தோர் CPR இலிருந்து முக்கியமான வேறுபாடுகள்.',
        youtubeId: 'Sh2vSNDr1gg',
        duration: '4:15',
        category: 'child'
    },
    {
        title: 'CPR for Infants (Under 1 year)',
        titleTamil: 'குழந்தைகளுக்கு CPR (1 வயதுக்கு கீழ்)',
        description: 'Specialized CPR for infants. Uses two-finger technique and gentle compressions.',
        descriptionTamil: 'குழந்தைகளுக்கு சிறப்பு CPR. இரண்டு விரல் நுட்பம் மற்றும் மென்மையான அழுத்தங்கள் பயன்படுத்துகிறது.',
        youtubeId: 'T4fJLFWQY8U',
        duration: '5:00',
        category: 'infant'
    }
];

export default function CPRVideosPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-neutral-50 dark:via-neutral-100 dark:to-neutral-50">
            {/* Header */}
            <div className="bg-emergency-red dark:bg-emergency-red-dark text-white py-8">
                <div className="container mx-auto px-4">
                    <Link href="/resources/first-aid" className="text-white/80 hover:text-white mb-4 inline-block">
                        ← Back to First Aid Guide
                    </Link>
                    <h1 className="text-4xl font-bold mb-2">❤️ CPR Tutorial Videos</h1>
                    <p className="text-red-100">Learn life-saving CPR techniques through video tutorials</p>
                </div>
            </div>

            {/* Important Notice */}
            <div className="bg-warning-amber text-warning-amber-dark py-4">
                <div className="container mx-auto px-4">
                    <p className="font-bold text-center">
                        📚 While videos are helpful, we strongly recommend taking a certified CPR course for hands-on practice
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                {/* Category Filters */}
                <div className="flex flex-wrap gap-4 mb-8 justify-center">
                    <div className="badge bg-primary-teal text-white px-6 py-2 text-lg">
                        All Videos
                    </div>
                </div>

                {/* Videos Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {cprVideos.map((video, idx) => (
                        <div key={idx} className="card card-glass overflow-hidden">
                            {/* Video Embed */}
                            <div className="aspect-video bg-neutral-900">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
                                    title={video.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            </div>

                            {/* Video Info */}
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="badge bg-secondary-blue text-white capitalize">
                                        {video.category}
                                    </span>
                                    <span className="text-sm text-text-secondary">⏱️ {video.duration}</span>
                                </div>

                                <h3 className="text-xl font-bold text-primary-teal mb-2">
                                    {video.title}
                                </h3>
                                <p className="text-text-secondary text-sm mb-2">
                                    {video.description}
                                </p>

                                <div className="border-t border-border-color pt-3 mt-3">
                                    <p className="text-sm text-text-accent font-semibold mb-1">
                                        {video.titleTamil}
                                    </p>
                                    <p className="text-sm text-text-secondary">
                                        {video.descriptionTamil}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Reference */}
                <div className="mt-12 max-w-3xl mx-auto card card-glass p-8">
                    <h2 className="text-2xl font-bold text-primary-teal mb-6 text-center">
                        Quick CPR Reference
                    </h2>

                    <div className="space-y-6">
                        <div className="bg-bg-accent p-4 rounded-lg">
                            <h3 className="font-bold text-primary-teal-dark mb-2">🎯 Key Points to Remember:</h3>
                            <ul className="space-y-2 text-sm">
                                <li>✓ <strong>Compressions:</strong> 100-120 per minute (rhythm of &quot;Stayin&apos; Alive&quot;)</li>
                                <li>✓ <strong>Depth:</strong> 2 inches (5cm) for adults, 1.5 inches for children</li>
                                <li>✓ <strong>Ratio:</strong> 30 compressions : 2 rescue breaths</li>
                                <li>✓ <strong>Don&apos;t stop</strong> until help arrives or person breathes</li>
                            </ul>
                        </div>

                        <div className="bg-emergency-red/10 p-4 rounded-lg border-2 border-emergency-red">
                            <h3 className="font-bold text-emergency-red mb-2">🚨 Emergency Numbers:</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm"><strong>Ambulance:</strong></p>
                                    <a href="tel:108" className="text-2xl font-bold text-primary-teal">108</a>
                                </div>
                                <div>
                                    <p className="text-sm"><strong>Emergency:</strong></p>
                                    <a href="tel:112" className="text-2xl font-bold text-primary-teal">112</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Resources */}
                <div className="mt-8 text-center">
                    <Link
                        href="/resources/helplines"
                        className="btn btn-primary inline-flex items-center gap-2"
                    >
                        📞 View All Emergency Helplines
                    </Link>
                </div>
            </div>
        </div>
    );
}
