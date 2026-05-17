import { useEffect, useState } from 'react';
import { Address, beginCell, fromNano, toNano } from '@ton/core';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';

// ─── Адрес контракта ────────────────────────────────────────────────────────
// Заменить на реальный адрес после деплоя
const CONTRACT_ADDRESS = 'EQAUyA0cf7PZur-VdxZnRRtjnRpXtmc6ABjhx1iMXy39x_aR'; // mainnet

// Op-коды — должны совпадать с контрактом
const OP_DEPOSIT        = 0;
const OP_WITHDRAW_ILYA  = 1;
const OP_WITHDRAW_ARTEM = 2;

// ─── Хук для работы с контрактом ────────────────────────────────────────────
export function useTridavinci() {
    const [tonConnectUI] = useTonConnectUI();
    const walletAddress  = useTonAddress(); // адрес подключённого кошелька

    const [ilyaBalance,  setIlyaBalance]  = useState<string>('—');
    const [artemBalance, setArtemBalance] = useState<string>('—');
    const [loading, setLoading] = useState(false);

    // Читаем балансы через tonapi.io (поддерживает get-методы на testnet и mainnet)
    async function fetchBalances() {
        try {
            const base = 'https://tonapi.io/v2/blockchain/accounts';
            const addr = CONTRACT_ADDRESS;

            const [resIlya, resArtem] = await Promise.all([
                fetch(`${base}/${addr}/methods/ilyaBalance`, { cache: 'no-store' }),
                fetch(`${base}/${addr}/methods/artemBalance`, { cache: 'no-store' }),
            ]);

            const dataIlya  = await resIlya.json();
            const dataArtem = await resArtem.json();

            // tonapi возвращает hex-строку вида "0x13ab6680" — парсим через BigInt
            const ilyaNano  = BigInt(dataIlya.stack[0].num);
            const artemNano = BigInt(dataArtem.stack[0].num);

            setIlyaBalance(fromNano(ilyaNano) + ' TON');
            setArtemBalance(fromNano(artemNano) + ' TON');
        } catch {
            setIlyaBalance('ошибка');
            setArtemBalance('ошибка');
        }
    }

    // Загружаем балансы при старте и каждые 10 секунд
    useEffect(() => {
        fetchBalances();
        const interval = setInterval(fetchBalances, 10_000);
        return () => clearInterval(interval);
    }, []);

    // Отправить депозит (op=0)
    async function sendDeposit(amountTon: string) {
        setLoading(true);
        try {
            await tonConnectUI.sendTransaction({
                validUntil: Math.floor(Date.now() / 1000) + 300, // 5 минут на подпись
                messages: [{
                    address: CONTRACT_ADDRESS,
                    amount:  toNano(amountTon).toString(),
                    payload: beginCell()
                        .storeUint(OP_DEPOSIT, 32)
                        .endCell()
                        .toBoc()
                        .toString('base64'),
                }],
            });
            // Обновляем балансы через 3 секунды после отправки
            setTimeout(fetchBalances, 3000);
        } finally {
            setLoading(false);
        }
    }

    // Илья выводит свою долю (op=1)
    async function withdrawIlya() {
        setLoading(true);
        try {
            await tonConnectUI.sendTransaction({
                validUntil: Math.floor(Date.now() / 1000) + 300,
                messages: [{
                    address: CONTRACT_ADDRESS,
                    amount:  toNano('0.05').toString(), // газ
                    payload: beginCell()
                        .storeUint(OP_WITHDRAW_ILYA, 32)
                        .endCell()
                        .toBoc()
                        .toString('base64'),
                }],
            });
            setTimeout(fetchBalances, 3000);
        } finally {
            setLoading(false);
        }
    }

    // Артём выводит свою долю (op=2)
    async function withdrawArtem() {
        setLoading(true);
        try {
            await tonConnectUI.sendTransaction({
                validUntil: Math.floor(Date.now() / 1000) + 300,
                messages: [{
                    address: CONTRACT_ADDRESS,
                    amount:  toNano('0.05').toString(), // газ
                    payload: beginCell()
                        .storeUint(OP_WITHDRAW_ARTEM, 32)
                        .endCell()
                        .toBoc()
                        .toString('base64'),
                }],
            });
            setTimeout(fetchBalances, 3000);
        } finally {
            setLoading(false);
        }
    }

    return {
        walletAddress,
        ilyaBalance,
        artemBalance,
        loading,
        sendDeposit,
        withdrawIlya,
        withdrawArtem,
    };
}
