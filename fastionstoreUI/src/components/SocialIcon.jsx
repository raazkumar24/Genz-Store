import React from 'react';

const SocialIcon = ({ 
    platform, 
    href, 
    className = '',
    size = 'md',
    variant = 'default',
    showLabel = false,
    ...props 
}) => {
    // Modern, clean SVG icons
    const iconMap = {
        instagram: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
        ),
        facebook: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
        ),
        twitter: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
        ),
        linkedin: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
            </svg>
        ),
        youtube: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
            </svg>
        ),
        pinterest: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h.5c.46 0 .82-.38.91-.82.13-.63.38-1.36.62-1.99.24-.59.14-1.2-.29-1.63C9.84 13.1 9.29 12 9.29 10.8c0-2.18 1.69-3.94 3.77-3.94 1.84 0 3.34 1.33 3.34 3.01 0 1.8-.79 3.4-1.98 4.44-.4.36-.57.9-.44 1.42.1.4.26.8.4 1.18.09.28.21.55.21.83 0 .55-.45 1-1 1h-.5c-.55 0-1-.45-1-1v-.41c0-.46.1-.91.26-1.32.16-.4.26-.83.26-1.27 0-1.21-.76-2.25-1.79-2.25-.84 0-1.55.67-1.55 1.55 0 .63.28 1.2.73 1.59.09.08.13.21.09.33-.05.2-.18.71-.24.91-.05.2-.16.23-.29.14-1.06-.54-1.65-1.73-1.65-2.91 0-2.36 1.91-4.27 4.27-4.27 2.36 0 4.27 1.91 4.27 4.27 0 2.36-1.91 4.27-4.27 4.27H12c-.55 0-1 .45-1 1v.5c0 .55.45 1 1 1h.5c.55 0 1-.45 1-1v-.5c0-.55-.45-1-1-1z"/>
            </svg>
        ),
        tiktok: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.3-.67.31-1.04.08-3.53.04-7.06.05-10.58L12.525.02z"/>
            </svg>
        ),
        github: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
        ),
        discord: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19.35 5.68A16.85 16.85 0 0 0 16.2 4.3a.19.19 0 0 0-.18.12 12.55 12.55 0 0 0-.77 1.62 15.55 15.55 0 0 0-4.5 0 12.55 12.55 0 0 0-.77-1.62.19.19 0 0 0-.18-.12 16.85 16.85 0 0 0-3.15 1.38.18.18 0 0 0-.07.07A17.2 17.2 0 0 0 4 8.66a.2.2 0 0 0 .08.18 15.43 15.43 0 0 0 3.9 1.98.19.19 0 0 0 .2-.07 11.27 11.27 0 0 0 .8-1.3.19.19 0 0 0-.1-.27 10.54 10.54 0 0 1-1.22-.58.19.19 0 0 1-.03-.3.19.19 0 0 1 .17-.05c.08.02.16.05.25.09a14.64 14.64 0 0 1 7.34 0c.09-.04.17-.07.25-.09a.19.19 0 0 1 .17.05.19.19 0 0 1-.03.3 10.54 10.54 0 0 1-1.22.58.19.19 0 0 0-.1.27c.24.46.52.9.8 1.3a.19.19 0 0 0 .2.07 15.43 15.43 0 0 0 3.9-1.98.2.2 0 0 0 .08-.18 17.2 17.2 0 0 0-1.65-2.68.18.18 0 0 0-.07-.07zM8.68 10.67a1.5 1.5 0 0 0-1.33 1.65c.06.91.5 1.65 1.33 1.65s1.27-.74 1.33-1.65a1.5 1.5 0 0 0-1.33-1.65zm6.64 0a1.5 1.5 0 0 0-1.33 1.65c.06.91.5 1.65 1.33 1.65s1.27-.74 1.33-1.65a1.5 1.5 0 0 0-1.33-1.65z"/>
            </svg>
        ),
        twitch: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.64 5.93h1.43v4.28h-1.43m3.93-4.28H17v4.28h-1.43M7 2L3.43 5.57v12.86h4.28V22l3.57-3.57h2.86L20.57 12V2m-1.43 9.29l-2.86 2.86h-2.86l-2.5 2.5v-2.5H7.71V3.43h11.43z"/>
            </svg>
        ),
        snapchat: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.3 2 4.5 4.1 4.5 8.1c0 3.8 2.3 6.2 2.3 6.2s-.3.2-.9.3c-.9.1-2.3.4-2.8 1.2-.4.7-.2 1.4.1 1.8.6.8 2.1 1.2 3.6 1.2.5 0 1-.1 1.3-.2.1 1.2.8 2.4 2.4 2.9.8.3 1.7.3 2.5.3s1.7 0 2.5-.3c1.6-.5 2.3-1.7 2.4-2.9.3.1.8.2 1.3.2 1.5 0 3-.4 3.6-1.2.3-.4.5-1.1.1-1.8-.5-.8-1.9-1.1-2.8-1.2-.6-.1-.9-.3-.9-.3s2.3-2.4 2.3-6.2C19.5 4.1 15.7 2 12 2z"/>
            </svg>
        ),
        whatsapp: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            </svg>
        ),
    };

    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
        xl: 'w-14 h-14',
    };

    const iconSizes = {
        sm: 'w-3.5 h-3.5',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
        xl: 'w-6 h-6',
    };

    const variants = {
        default: 'bg-[var(--color-surface)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white hover:scale-110 hover:shadow-lg',
        outline: 'bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white border-2 border-[var(--color-primary)] hover:scale-110',
        filled: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] hover:scale-110 hover:shadow-lg',
        ghost: 'bg-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)] hover:scale-110',
        gradient: 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] text-white hover:scale-110 hover:shadow-lg',
        glass: 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:scale-110 border border-white/20',
    };

    const platformNames = {
        instagram: 'Instagram',
        facebook: 'Facebook',
        twitter: 'Twitter',
        linkedin: 'LinkedIn',
        youtube: 'YouTube',
        pinterest: 'Pinterest',
        tiktok: 'TikTok',
        github: 'GitHub',
        discord: 'Discord',
        twitch: 'Twitch',
        snapchat: 'Snapchat',
        whatsapp: 'WhatsApp',
    };

    // All platforms now use the same hover style - using your CSS variables
    // Each platform gets its brand color as a solid color on hover
    const platformHoverColors = {
        instagram: 'hover:bg-[#E4405F]', // Simple solid color instead of gradient
        facebook: 'hover:bg-[#1877F2]',
        twitter: 'hover:bg-[#000000]',
        linkedin: 'hover:bg-[#0A66C2]',
        youtube: 'hover:bg-[#FF0000]',
        pinterest: 'hover:bg-[#E60023]',
        tiktok: 'hover:bg-[#000000]',
        github: 'hover:bg-[#181717]',
        discord: 'hover:bg-[#5865F2]',
        twitch: 'hover:bg-[#9146FF]',
        snapchat: 'hover:bg-[#FFFC00] hover:text-[#000000]',
        whatsapp: 'hover:bg-[#25D366]',
    };

    // Alternative: All platforms use your primary color (consistent branding)
    // Uncomment below if you want all icons to use your brand color on hover
    /*
    const platformHoverColors = {
        instagram: 'hover:bg-[var(--color-primary)] hover:text-white',
        facebook: 'hover:bg-[var(--color-primary)] hover:text-white',
        twitter: 'hover:bg-[var(--color-primary)] hover:text-white',
        linkedin: 'hover:bg-[var(--color-primary)] hover:text-white',
        youtube: 'hover:bg-[var(--color-primary)] hover:text-white',
        pinterest: 'hover:bg-[var(--color-primary)] hover:text-white',
        tiktok: 'hover:bg-[var(--color-primary)] hover:text-white',
        github: 'hover:bg-[var(--color-primary)] hover:text-white',
        discord: 'hover:bg-[var(--color-primary)] hover:text-white',
        twitch: 'hover:bg-[var(--color-primary)] hover:text-white',
        snapchat: 'hover:bg-[var(--color-primary)] hover:text-white',
        whatsapp: 'hover:bg-[var(--color-primary)] hover:text-white',
    };
    */

    const variantStyles = {
        default: 'shadow-sm hover:shadow-md',
        outline: 'hover:shadow-md',
        filled: 'shadow-md hover:shadow-lg',
        ghost: '',
        gradient: 'shadow-lg hover:shadow-xl',
        glass: 'shadow-lg backdrop-blur-sm',
    };

    // For default variant, use platform colors, otherwise use variant styles
    const getHoverClass = () => {
        if (variant === 'default') {
            return platformHoverColors[platform] || 'hover:bg-[var(--color-primary)] hover:text-white';
        }
        return '';
    };

    return (
        <a
            href={href || '#'}
            className={`
                rounded-full flex items-center justify-center 
                transition-all duration-300 
                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]
                ${variants[variant] || variants.default}
                ${sizes[size] || sizes.md}
                ${variantStyles[variant] || ''}
                ${getHoverClass()}
                ${className}
            `}
            aria-label={`Follow us on ${platformNames[platform] || platform}`}
            target="_blank"
            rel="noopener noreferrer"
            {...props}
        >
            <span className={`${iconSizes[size] || iconSizes.md} flex-shrink-0`}>
                {iconMap[platform] || iconMap.instagram}
            </span>
            {showLabel && (
                <span className="ml-2 text-xs font-medium">
                    {platformNames[platform] || platform}
                </span>
            )}
        </a>
    );
};

export default SocialIcon;