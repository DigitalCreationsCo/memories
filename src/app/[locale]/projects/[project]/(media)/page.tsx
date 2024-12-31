"use client"

import Media from "@/components/project/media/media";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function MediaPage() {
    const t = useTranslations('common');
    const [visible, setVisible] = useState(false);
    return (
        <div className="flex flex-col px-5">
             <div className="flex items-start justify-between">
                <h4 className="font-medium tracking-tight">Media</h4>
                <Button
                variant='outline'
                color="primary"
                onClick={() => {
                    setVisible(!visible);
                }}
                >
                {t('upload-media')}
                </Button>
            </div>
            <div className="flex flex-col pt-4">
                <Media images={[]} />
            </div>
        </div>
    )
}