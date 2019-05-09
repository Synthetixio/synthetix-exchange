import React from 'react';
import styles from './synth-picker.module.scss';

const renderSynths = (synths, balances, onSynthSelect) => {
  const filteredSynths = synths.filter(synth => {
    return ['crypto', 'forex', 'commodity'].includes(synth.category);
    // return (
    //   (!balances ||
    //     (balances && balances[synth.name] && balances[synth.name] > 0)) &&
    //   ['crypto', 'forex', 'commodity'].includes(synth.category)
    // );
  });
  return (
    <div className={styles.synthTableBody}>
      {filteredSynths.length > 0 ? (
        filteredSynths.map(synth => {
          return (
            <div
              key={synth.name}
              className={styles.synthWrapper}
              onClick={onSynthSelect(synth)}
            >
              <img src={`/images/synths/${synth.name}-icon.svg`} />
              <span>{synth.name}</span>
            </div>
          );
        })
      ) : (
        <div>No synths</div>
      )}
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
