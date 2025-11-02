import { promises as fs } from 'fs';
import path from 'path';
import type { University } from '@/types/university';

function normalizeJsonToUniversity(row: any): University | null {
    if (!row) return null;
    const idNum = Number(row.id);
    if (Number.isNaN(idNum)) return null;
    return {
        id: idNum,
        vari: row.vari ?? row.vari ?? '',
        hex: row.hex ?? '',
        alue: row.alue ?? '',
        ala: row.ala ?? null,
        ainejärjestö: row.ainejärjestö ?? null,
        oppilaitos: row.oppilaitos ?? '',
    };
}

export async function loadUniversities(): Promise<University[]> {
    const jsonFilePath = path.join(process.cwd(), 'data', 'overall_colors.json');
    const rootJsonFilePath = path.join(process.cwd(), 'overall_colors_rows.json');

    let universities: University[] = [];
    try {
        const json = await fs.readFile(jsonFilePath, 'utf-8');
        universities = (JSON.parse(json) as any[])
            .map(normalizeJsonToUniversity)
            .filter(Boolean) as University[];
    } catch {
        try {
            const json = await fs.readFile(rootJsonFilePath, 'utf-8');
            universities = (JSON.parse(json) as any[])
                .map(normalizeJsonToUniversity)
                .filter(Boolean) as University[];
        } catch {
            return [];
        }
    }
    return universities;
}

