import Script from 'next/script';

export default function FAQSchema() {
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'Minkä värinen haalari tietyn alan opiskelijalla on?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Haalarivärit vaihtelevat alan ja oppilaitoksen mukaan. Käytä Haalarikonetta löytääksesi tarkat haalarivärit eri alojen opiskelijoille yliopisto- ja AMK-tasolla.',
                },
            },
            {
                '@type': 'Question',
                name: 'Miten haalarivärit valitaan?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Haalarivärit valitaan yleensä opiskelijajärjestöjen ja oppilaitosten kesken yhteisesti. Jokaisella alalla ja yliopistolla voi olla omat perinteet ja säännöt haalarivärien valintaan.',
                },
            },
            {
                '@type': 'Question',
                name: 'Onko kaikilla yliopistoilla samat haalarivärit?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Ei, haalarivärit vaihtelevat huomattavasti yliopistojen ja alojen välillä. Jopa sama ala voi käyttää eri värejä eri yliopistoissa.',
                },
            },
            {
                '@type': 'Question',
                name: 'Mitä eroa on AMK:n ja yliopiston haalariväreillä?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'AMK:lla ja yliopistoilla on yleensä omat haalarivärit, vaikka ala olisi sama. Usein myös eri alueilla saman oppilaitoksen haalarivärit voivat vaihdella.',
                },
            },
            {
                '@type': 'Question',
                name: 'Voiko haalariväri muuttua?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Haalarivärit voivat muuttua ajan myötä, kun opiskelijajärjestöt päättävät vaihtaa värejä. Tämä on suhteellisen harvinaista, mutta ei mahdotonta.',
                },
            },
            {
                '@type': 'Question',
                name: 'Mistä löydän kaikki haalarivärit?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Haalarikone on Suomen kattavin haalaritietokanta, josta löydät haalarivärit kaikille suomalaisille yliopistoille ja AMK:lle. Voit hakea väriä, alaa, yliopistoa tai aluetta.',
                },
            },
        ],
    };

    return (
        <Script
            id="faq-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
    );
}

