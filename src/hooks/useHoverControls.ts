import { useCallback, useState } from 'react';

export const useHoverControls = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleMouseEnter = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isDropdownOpen) {
            setIsHovered(false);
        }
    }, [isDropdownOpen]);

    const handleDropdownChange = useCallback((open: boolean) => {
        setIsDropdownOpen(open);
        if (!open) {
            setIsHovered(false);
        }
    }, []);

    return {
        isHovered,
        isDropdownOpen,
        handleMouseEnter,
        handleMouseLeave,
        handleDropdownChange,
    };
}; 