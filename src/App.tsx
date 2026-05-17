import React, { useState } from 'react';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTridavinci } from './useTridavinci';

export default function App() {
    const {
        walletAddress,
        ilyaBalance,
        artemBalance,
        loading,
        sendDeposit,
        withdrawIlya,
        withdrawArtem,
    } = useTridavinci();

    const [depositAmount, setDepositAmount] = useState('100');

    return (
        <div style={styles.page}>
            <div style={styles.card}>

                {/* Заголовок */}
                <h1 style={styles.title}>Tridavinci</h1>
                <p style={styles.subtitle}>Разделитель дивидендов</p>

                {/* Кнопка подключения кошелька — TonConnect рисует её сам */}
                <div style={styles.connectRow}>
                    <TonConnectButton />
                </div>

                {/* Балансы учредителей */}
                <div style={styles.balances}>
                    <div style={styles.balance}>
                        <div style={styles.balanceName}>Илья <span style={styles.share}>33%</span></div>
                        <div style={styles.balanceAmount}>{ilyaBalance}</div>
                        <button
                            style={styles.button}
                            disabled={!walletAddress || loading}
                            onClick={withdrawIlya}
                        >
                            Вывести
                        </button>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.balance}>
                        <div style={styles.balanceName}>Артём <span style={styles.share}>66%</span></div>
                        <div style={styles.balanceAmount}>{artemBalance}</div>
                        <button
                            style={styles.button}
                            disabled={!walletAddress || loading}
                            onClick={withdrawArtem}
                        >
                            Вывести
                        </button>
                    </div>
                </div>

                {/* Форма депозита */}
                <div style={styles.depositSection}>
                    <p style={styles.depositLabel}>Внести депозит</p>
                    <div style={styles.depositRow}>
                        <input
                            style={styles.input}
                            type="number"
                            value={depositAmount}
                            onChange={e => setDepositAmount(e.target.value)}
                            placeholder="Сумма в TON"
                            min="0.1"
                        />
                        <span style={styles.inputUnit}>TON</span>
                        <button
                            style={{...styles.button, ...styles.depositButton}}
                            disabled={!walletAddress || loading || !depositAmount}
                            onClick={() => sendDeposit(depositAmount)}
                        >
                            {loading ? '...' : 'Отправить'}
                        </button>
                    </div>
                    <p style={styles.depositHint}>
                        1% останется на контракте · {(+depositAmount * 0.33).toFixed(2)} TON → Илья · {(+depositAmount * 0.66).toFixed(2)} TON → Артём
                    </p>
                </div>

                {/* Подсказка если кошелёк не подключён */}
                {!walletAddress && (
                    <p style={styles.hint}>Подключите кошелёк Tonkeeper чтобы отправлять транзакции</p>
                )}

            </div>
        </div>
    );
}

// ─── Стили ──────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    card: {
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    },
    title: {
        fontSize: '28px',
        fontWeight: '700',
        textAlign: 'center',
        color: '#1a1a2e',
    },
    subtitle: {
        textAlign: 'center',
        color: '#888',
        marginTop: '4px',
        marginBottom: '24px',
    },
    connectRow: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '32px',
    },
    balances: {
        display: 'flex',
        gap: '16px',
        marginBottom: '32px',
    },
    balance: {
        flex: 1,
        background: '#f8f9ff',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center',
    },
    balanceName: {
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '8px',
        color: '#1a1a2e',
    },
    share: {
        fontSize: '12px',
        color: '#888',
        fontWeight: '400',
    },
    balanceAmount: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#667eea',
        marginBottom: '16px',
    },
    divider: {
        width: '1px',
        background: '#eee',
    },
    button: {
        width: '100%',
        padding: '10px',
        background: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        opacity: 1,
    },
    depositSection: {
        borderTop: '1px solid #eee',
        paddingTop: '24px',
    },
    depositLabel: {
        fontWeight: '600',
        marginBottom: '12px',
        color: '#1a1a2e',
    },
    depositRow: {
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        padding: '10px 12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '16px',
        outline: 'none',
    },
    inputUnit: {
        color: '#888',
        fontSize: '14px',
    },
    depositButton: {
        width: 'auto',
        padding: '10px 20px',
        whiteSpace: 'nowrap',
    },
    depositHint: {
        marginTop: '8px',
        fontSize: '12px',
        color: '#aaa',
    },
    hint: {
        textAlign: 'center',
        color: '#aaa',
        fontSize: '13px',
        marginTop: '16px',
    },
};
