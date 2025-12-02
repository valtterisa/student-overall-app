import Script from 'next/script';

export default function FAQSchema() {
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'Mistä löydän kaikki haalarivärit Suomessa?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Haalarikone on Suomen kattavin haalarivärit-tietokanta, josta löydät yli 500 haalariväriä kaikille suomalaisille yliopistoille ja AMK:lle. Voit hakea haalarivärejä alan, oppilaitoksen, alueen tai värin perusteella.',
                },
            },
            {
                '@type': 'Question',
                name: 'Mitkä ovat suosituimmat haalarivärit?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Suosituimpia haalarivärejä Suomessa ovat punainen, sininen, musta ja vihreä. Esimerkiksi teekkarit käyttävät usein eri sävyisiä haalareita kuin kauppatieteilijät tai lääketieteilijät.',
                },
            },
            {
                '@type': 'Question',
                name: 'Miten haalarivärit valitaan opiskelijajärjestöissä?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Haalarivärit valitaan yleensä opiskelijajärjestöjen ja oppilaitosten kesken yhteisesti. Jokaisella alalla ja yliopistolla voi olla omat perinteet ja säännöt haalarivärien valintaan.',
                },
            },
            {
                '@type': 'Question',
                name: 'Onko yliopistojen ja AMK:iden haalarivärit samat?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Ei, haalarivärit vaihtelevat huomattavasti yliopistojen ja AMK:iden välillä. AMK:lla ja yliopistoilla on yleensä omat haalarivärit, vaikka ala olisi sama. Myös eri alueilla saman oppilaitoksen haalarivärit voivat vaihdella.',
                },
            },
            {
                '@type': 'Question',
                name: 'Mikä on haalarivärien merkitys opiskelijakulttuurissa?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Haalarivärit ovat tärkeä osa suomalaista opiskelijakulttuuria. Ne auttavat tunnistamaan opiskelijan alan ja oppilaitoksen, ja luovat yhteisöllisyyttä opiskelijoiden kesken. Haalarivärit näkyvät erityisesti opiskelijatapahtumissa ja vappu-juhlissa.',
                },
            },
            {
                '@type': 'Question',
                name: 'Voiko haalariväri muuttua?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Haalarivärit voivat muuttua ajan myötä, kun opiskelijajärjestöt päättävät vaihtaa värejä. Tämä on suhteellisen harvinaista, mutta ei mahdotonta. Haalarikone päivittää haalarivärit säännöllisesti.',
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

