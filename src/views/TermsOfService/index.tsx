import Page from 'components/common/Page'
import { Link } from 'react-router-dom'
import { Flex, Text } from 'rebass/styled-components'

export default function TermsOfService() {
  return (
    <Page title="Terms of Service">
      <Flex width="90%" flexDirection="column" marginX="auto" mb="20px">
        <Text variant="heading2" fontSize="14px">
          MuesliSwap Disclaimer and Terms of Service
        </Text>

        <Text variant="regular" mt="25px" mb="20px" fontSize="14px">
          <b> Protocol Disclaimer </b> <br />
          The MuesliSwap protocol is a decentralized peer-to-peer protocol that people can use to create liquidity pools
          and trade Cardano native tokens. There are two versions of the MuesliSwap protocol (v1, v2), each of which is
          made up of free, public, open-source software including a set of smart contracts that are deployed on the
          Cardano Blockchain. Your use of the MuesliSwap protocol involves various risks, including, but not limited to,
          losses while digital assets are being supplied to the MuesliSwap protocol and losses due to the fluctuation of
          prices of tokens in a trading pair or liquidity pool. Before using the MuesliSwap protocol, you should review
          the relevant documentation to make sure you understand how the protocol works. Additionally, just as you can
          access email email protocols such as SMTP through multiple email clients, you can access the MuesliSwap
          protocol through dozens of web or mobile interfaces. You are responsible for doing your own diligence on those
          interfaces to understand the fees and risks they present. <br /> <br />
          Although MuesliSwap developed much of the initial software code for the MuesliSwap Protocol, it does not
          provide, own, or control the MuesliSwap Protocol, which is run independently by smart contracts deployed on
          the Cardano blockchain. The Protocol does not constitute an account by which MuesliSwap or any other third
          parties act as financial intermediaries or custodians. No developer or entity involved in creating the
          MuesliSwap protocol will be liable for any claims or damages whatsoever associated with your use, inability to
          use, or your interaction with other users of, the Muesliswap protocol, including any direct, indirect,
          incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies,
          tokens, or anything else of value. <br /> <br />
          THE MUESLISWAP PROTOCOL, THE SITE AND ALL INFORMATION CONTAINED ON THE SITE, ARE PROVIDED “AS IS” AND “AS
          AVAILABLE” BASIS, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.
        </Text>

        <Text variant="regular" mt="25px" fontSize="12px">
          <b>Terms of Service</b> <br />
          Last modified: 25th August 2022
        </Text>
        <Text variant="regular" mt="15px" fontSize="14px">
          https://muesliswap.com, https://ada.muesliswap.com are a website-hosted user interfaces (the
          &apos;Interface&apos;) provided by &apos;MuesliSwap&apos;. <br />
          The Interface provides access to a decentralized protocol on the Cardano blockchain that allows users to trade
          certain native tokens (&apos; the Protocol&apos;). The Interface is just one, but not the exclusive, means of
          accessing the Protocol. <br /> <br />
          These Terms of Service (&apos;terms&apos;) explains the terms and conditions by which you may access and use
          the Interface. You must read this Agreement carefully. By accessing or using the Interface, you signify that
          you have read, understand, and agree to be bound by this Agreement in its entirety. If you do not agree, you
          are not authorized to access or use the Interface and should not use the Interface. <br /> <br />
          <b>
            {' '}
            NOTICE: Please read the terms carefully as it governs your use the interface. The Interface is only
            available to you — and you should only access the Interface — if you agree completely with these terms.{' '}
          </b>{' '}
          <br /> <br />
          <b> Modification of the Terms </b> <br />
          We reserve the right, in our sole discretion, to modify these terms from time to time. If we make any
          modifications, we will notify you by updating the date at the top of the terms and by maintaining a current
          version on our website. All modifications will be effective when they are posted, and your continued accessing
          or use of the Interface will serve as confirmation of your acceptance of those modifications. If you do not
          agree with any modifications to the terms, you must immediately stop accessing and using the Interface. <br />{' '}
          <br />
          <b>Eligibility</b> <br />
          To access or use the Interface, you must be able to accept these terms. Accordingly, you represent that you
          are at least the age of majority in your jurisdiction (e.g., eighteen years old) and have the full right,
          power, and authority to enter into and comply with the terms and conditions of this Agreement on behalf of
          yourself and any company or legal entity for which you may access or use the Interface. <br /> <br />
          Finally, you represent that your access and use of the Interface will fully comply with all applicable laws
          and regulations, and that you will not access or use the Interface to conduct, promote, or otherwise
          facilitate any illegal activity.
        </Text>

        <Text variant="regular" mt="15px" fontSize="14px">
          <b>Proprietary Rights</b>
          We own all intellectual property and other rights in the Interface and its contents, including (but not
          limited to) software, text, images, trademarks, service marks, copyrights, patents, and designs. Unlike the
          Interface, versions 1-2 of the protocol are comprised entirely of open-source or source-available software
          running on the public Ethereum blockchain.
        </Text>

        <Text variant="regular" mt="15px" fontSize="14px">
          <b>Additional Rights</b>
          We reserve the following rights, which do not constitute obligations of ours: (a) with or without notice to
          you, to modify, substitute, eliminate or add to the Interface; (b) to review, modify, filter, disable, delete
          and remove any and all content and information from the Interface; and (c) to cooperate with any law
          enforcement, court or government investigation or order or third party requesting or directing that we
          disclose information or content or information that you provide.
        </Text>

        <Text variant="regular" mt="15px" fontSize="14px">
          <b>Privacy</b>
          Please make sure that you comply with out data privacy policy outlined in{' '}
          <Link to="/privacy"> the Privacy section</Link> of this website. A link to the newest privacy section can also
          be found in the footer of this website.
        </Text>

        <Text variant="regular" mt="15px" fontSize="14px">
          <b>Prohibited Activity</b>
          You agree not to engage in, or attempt to engage in, any of the following categories of prohibited activity in
          relation to your access and use of the Interface: <br />
          Intellectual Property Infringement. Activity that infringes on or violates any copyright, trademark, service
          mark, patent, right of publicity, right of privacy, or other proprietary or intellectual property rights under
          the law. <br /> <br />
          Cyberattack. Activity that seeks to interfere with or compromise the integrity, security, or proper
          functioning of any computer, server, network, personal device, or other information technology system,
          including (but not limited to) the deployment of viruses and denial of service attacks. <br />
          Fraud and Misrepresentation. Activity that seeks to defraud us or any other person or entity, including (but
          not limited to) providing any false, inaccurate, or misleading information in order to unlawfully obtain the
          property of another. <br />
          Market Manipulation. Activity that violates any applicable law, rule, or regulation concerning the integrity
          of trading markets, including (but not limited to) the manipulative tactics commonly known as spoofing and
          wash trading. <br />
          Any Other Unlawful Conduct. Activity that violates any applicable law, rule, or regulation of Switzerland or
          another relevant jurisdiction, including (but not limited to) the restrictions and regulatory requirements
          imposed by Swiss law <br />
        </Text>

        <Text variant="regular" mt="15px" fontSize="14px">
          <b>Not Registered Trading Facility</b> <br />
          We are not registered as an Exchange or in any other capacity. You understand and acknowledge that we do not
          broker trading orders on your behalf. We also do not facilitate the execution or settlement of your trades,
          which occur entirely on the public distributed Cardano blockchain. You understand that the interface only
          helps you to constructs a transaction which you use to interact with the Cardano blockchain.
        </Text>
        <Text variant="regular" mt="15px" fontSize="14px">
          <b>Non-Solicitation; No Investment Advice</b> <br />
          You agree and understand that all trades you submit through the Interface are considered unsolicited, which
          means that you have not received any investment advice from us in connection with any trades, including those
          you place via our Auto Router API, and that we do not conduct a suitability review of any trades you submit.{' '}
          <br />
          All information provided by the Interface is for informational purposes only and should not be construed as
          investment advice. You should not take, or refrain from taking, any action based on any information contained
          in the Interface. We do not make any investment recommendations to you or opine on the merits of any
          investment transaction or opportunity. You alone are responsible for determining whether any investment,
          investment strategy or related transaction is appropriate for you based on your personal investment
          objectives, financial circumstances, and risk tolerance. <br />
        </Text>

        <Text variant="regular" mt="15px" fontSize="14px">
          <b>No Warranties</b> <br />
          The Interface is provided on an &apos;AS IS&apos; and &apos;AS AVAILABLE&apos; basis. To the fullest extent
          permitted by law, we disclaim any representations and warranties of any kind, whether express, implied, or
          statutory, including (but not limited to) the warranties of merchantability and fitness for a particular
          purpose. You acknowledge and agree that your use of the Interface is at your own risk. We do not represent or
          warrant that access to the Interface will be continuous, uninterrupted, timely, or secure; that the
          information contained in the Interface will be accurate, reliable, complete, or current; or that the Interface
          will be free from errors, defects, viruses, or other harmful elements. No advice, information, or statement
          that we make should be treated as creating any warranty concerning the Interface. We do not endorse,
          guarantee, or assume responsibility for any advertisements, offers, or statements made by third parties
          concerning the Interface.
        </Text>

        <Text variant="regular" mt="15px" fontSize="14px">
          <b>Assumption of Risk</b> <br />
          By accessing and using the Interface, you represent that you are financially and technically sophisticated
          enough to understand the inherent risks associated with using cryptographic and blockchain-based systems, and
          that you have a working knowledge of the usage and intricacies of digital assets such as bitcoin (BTC), ether
          (ETH), Cardano and other native tokens on the Cardano Network. In particular, you understand that
          blockchain-based transactions are irreversible.
          <br /> <br />
          You further understand that the markets for these digital assets are highly volatile due to factors including
          (but not limited to) adoption, speculation, technology, security, and regulation. You acknowledge and accept
          that the cost and speed of transacting with cryptographic and blockchain-based systems such as Cardano are
          variable and may increase dramatically at any time. You further acknowledge and accept the risk that your
          digital assets may lose some or all of their value while they are supplied to the Protocol through the
          Interface, you may suffer loss due to the fluctuation of prices of tokens in a trading pair or liquidity pool.
          You understand that anyone can create a token, including fake versions of existing tokens and tokens that
          falsely claim to represent projects, and acknowledge and accept the risk that you may mistakenly trade those
          or other tokens. You further acknowledge that we are not responsible for any of these variables or risks, do
          not own or control the Protocol, and cannot be held liable for any resulting losses that you experience while
          accessing or using the Interface. Accordingly, you understand and agree to assume full responsibility for all
          of the risks of accessing and using the Interface to interact with the Protocol.
        </Text>

        <Text variant="regular" mt="15px" fontSize="14px">
          <b>Non-Custodial and No Fiduciary Duties</b> <br />
          The Interface is a purely non-custodial application, meaning you are solely responsible for the custody of the
          cryptographic private keys to the digital asset wallets you hold. This term is not intended to, and does not,
          create or impose any fiduciary duties on MuesliSwap. To the fullest extent permitted by law, you acknowledge
          and agree that we owe no fiduciary duties or liabilities to you or any other party, and that to the extent any
          such duties or liabilities may exist at law or in equity, those duties and liabilities are hereby irrevocably
          disclaimed, waived, and eliminated. You further agree that the only duties and obligations that we owe you are
          those set out expressly in these terms.
        </Text>

        <Text variant="regular" mt="15px" fontSize="14px">
          <b>Compliance Obligations</b> <br />
          The Interface is operated from facilities within Switzerland. The Interface may not be available or
          appropriate for use in other jurisdictions. By accessing or using the Interface, you agree that you are solely
          and entirely responsible for compliance with all laws and regulations that may apply to you.
        </Text>

        <Text variant="regular" mt="15px" fontSize="14px">
          <b>Third-Party Resources and Promotions</b> <br />
          The Interface may contain references or links to third-party resources, including (but not limited to)
          information, materials, products, or services, that we do not own or control. In addition, third parties may
          offer promotions related to your access and use of the Interface. We do not endorse or assume any
          responsibility for any such resources or promotions. If you access any such resources or participate in any
          such promotions, you do so at your own risk, and you understand that this Agreement does not apply to your
          dealings or relationships with any third parties. You expressly relieve us of any and all liability arising
          from your use of any such resources or participation in any such promotions.
        </Text>

        <Text variant="regular" mt="15px" fontSize="14px">
          <b>Governing Law</b> <br />
          You agree that the laws of Switzerland, without regard to principles of conflict of laws, govern this terms
          and any dispute between you and us. You further agree that the Interface shall be deemed to be based solely in
          Zug Switzerland, and that although the Interface may be available in other jurisdictions, its availability
          does not give rise to general or specific personal jurisdiction in any forum outside Switzerland. You agree
          that the competent courts of Zug Switzerland are the proper forum for any appeals of an arbitration award or
          for court proceedings in the event that this terms binding arbitration clause is found to be unenforceable.
        </Text>
      </Flex>
    </Page>
  )
}
