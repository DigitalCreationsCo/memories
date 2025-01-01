"use client"

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Albums from "@/components/project/album/albums";

export default function AlbumsPage() {
    const t = useTranslations('common');
    const [visible, setVisible] = useState(false);
    return (
        <div className="flex flex-col px-5">
             <div className="flex items-start justify-between">
                <h4 className="font-medium tracking-tight">Albums</h4>
                <Button
                variant='outline'
                color="primary"
                onClick={() => {
                    setVisible(!visible);
                }}
                >
                {t('create-album')}
                </Button>
            </div>
            <div className="flex flex-col pt-4">
                <Albums />
            </div>
        </div>
    )
}