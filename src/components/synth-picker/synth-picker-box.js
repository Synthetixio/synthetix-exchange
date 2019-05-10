import React from 'react';
import styles from './synth-picker.module.scss';
import numbro from 'numbro';

const renderSynths = (synths, balances, onSynthSelect) => {
  const filteredSynths = synths.filter(synth => {
    return ['crypto', 'forex', 'commodity'].includes(synth.category);
  });
  return (
    <div className={styles.synthTableBody}>
      {filteredSynths.map(synth => {
        return (
          <div
            key={synth.name}
            className={styles.synthWrapper}
            onClick={onSynthSelect(synth)}
          >
            <img src={`/images/synths/${synth.name}-icon.svg`} />
            <span>{synth.name}</span>
            {balances && balances[synth.name] ? (
              <span className={styles.synthTableBalance}>
                {synth.sign}
                {numbro(Number(balances[synth.name])).format('0,0.00')}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

const SynthPickerBox = ({ position, synths, balances, onSynthSelect }) => {
  return (
    <div style={position} className={styles.synthPickerBox}>
      <div className={styles.synthTable}>
        {renderSynths(synths, balances, onSynthSelect)}
      </div>
    </div>
  );
};

export default SynthPickerBox;
