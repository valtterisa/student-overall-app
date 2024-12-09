'use client'

import { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import Image from 'next/image';

const messages = [
    "Hiljaista kuin Otaniemen metroasema keskiyöllä. 🤔 Paina hakua, niin ehkä löydät elämää täältäkin!",
    "Tyhjää kuin opiskelijan lompakossa päivää ennen opintotukea. 🤔 Anna haulle mahdollisuus pelastaa päivä!",
    "Täällä on yhtä autiota kuin Kuopion torilla sadepäivänä. 🤔 Kokeile hakua – maksaa vähemmän kuin kalakukko!",
    "Hiljaista kuin kirjastossa perjantai-iltana. 🤔 Klikkaa hakua ennen kuin tylsyys iskee!",
    "Täällä on yhtä paljon nähtävää kuin pääkaupunkiseudun talvisessa maisemassa – pelkkää harmaata. 🤔 Kokeile hakua, niin saat ehkä väriä päivään!",
    "Täällä on hiljaista kuin työhaastattelussa, kun kysytään 'Missä näet itsesi viiden vuoden päästä?'. 🤔 Paina hakua ja saa edes jotain aikaan!",
    "Ei tuloksia – vähän sama kuin yrittäisi löytää ilmaista kahvia yliopistolla. 🤔 Anna haulle mahdollisuus loistaa!",
    "Täällä on tyhjää kuin ruokalassa kasvisvaihtoehdon loputtua. 🤔 Kokeile hakua, niin löydät ehkä parempaa purtavaa!",
    "Täällä on hiljaisempaa kuin luentosalissa, kun kysytään vapaaehtoisia projektiryhmään. 🤔 Klikkaa hakua ja täytä tämä tyhjyys!",
    "Serveri ry GOD TIER! Serveriii!!!! <33333 Ennestään hajalla ollut mielenterveys meni tätä koodatessa :) Mut joo kokeile käyttää tota hakua yläpuolella!",
];

function PlaceholderDisplay() {
    const [currentMessage, setCurrentMessage] = useState("");

    useEffect(() => {
        // Pick a random message when the component is mounted (on page refresh)
        const randomIndex = Math.floor(Math.random() * messages.length);
        setCurrentMessage(messages[randomIndex]);
    }, []);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div
                className="flex items-center justify-center w-full min-h-[8rem] bg-gray-100 rounded-lg shadow-lg p-4 max-w-xl mx-auto overflow-hidden"
            ><div className="py-8 flex flex-col items-center justify-center gap-4 text-center">
                    <Image
                        src="/no-results.svg"
                        alt="No Results"
                        width={120}
                        height={120}
                    />
                    <p className="text-gray-600 text-base">
                        {currentMessage}
                    </p>
                </div></div>
        </motion.div>
    )
}

export default PlaceholderDisplay