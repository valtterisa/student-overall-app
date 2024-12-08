'use client'

import { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import Image from 'next/image';

const messages = [
    "Hiljaista kuin tentti-iltana oppimateriaalin ääressä. 🤔 Kokeile hakua, niin ehkä tulee jotain viisasta vastaan!",
    "Mitään ei näy, aivan kuin fuksin haalareita katsoisi. 🤔 Anna haulle mahdollisuus kasvattaa sisältöä!",
    "Täällä on tyhjää kuin opiskelijan jääkaapissa kuukauden lopussa. 🤔 Hakua painamalla saatat löytää täytettä elämään!",
    "Tyhjää kuin palautuskansion deadlinen jälkeisenä aamuna. 🤔 Kokeile yläpuolen hakua ennen kuin paniikki iskee!",
    "Näyttää siltä, että täältä löytyy yhtä paljon kuin opintotuesta jää säästöön. 🤔 Anna hakukoneelle mahdollisuus!",
    "Täällä on tyhjempää kuin opiskelijabileiden vesipisteellä. 🤔 Kokeile hakua, niin saat vähän eloa tähän paikkaan!",
    "Ei tuloksia – vähän sama kuin odottaisi ilmaista lounasta kampuksella. 🤔 Anna haulle tilaisuus loistaa!",
    "Tyhjää kuin luentosalin ensimmäinen rivi yhdeksän aamulähdöllä. 🤔 Kokeile hakua, niin täytetään tämä tila!",
    "Täällä on yhtä hiljaista kuin kirjasto kahvitauon aikaan. 🤔 Kokeile hakua ja katso, löytyykö jotain opiskelijan arkea piristävää!",
    "Serveriiiiiiiiiiii!!!!! (Serveri ry <3333) - Juuh kokeile hakua tää on vaa placeholder. PS. käytettiin ihan liikaa aikaa tän tekemiseen......."
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