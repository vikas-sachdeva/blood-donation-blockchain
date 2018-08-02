'use strict';

/**
 *
 * @param {blood.donation.assets.DonarToReceiverTransfer} tx
 * @transaction
 */
async function DonarToReceiverTransfer(tx) {

    if (tx.bloodUnit.bloodGroup !== tx.receiver.bloodGroup) {
        throw new Error('Blood Group not matched');
    }
    if (tx.bloodUnit.bloodDonated) {
        throw new Error('Blood unit is already donated');
    }
    tx.bloodUnit.bloodDonated = true;
    tx.bloodUnit.owner = tx.receiver;

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('blood.donation.assets.BloodUnit');
    // Update the asset in the asset registry.
    await assetRegistry.update(tx.bloodUnit);

}

/**
 *
 * @param {blood.donation.assets.DonarToBankTransfer} tx
 * @transaction
 */
async function DonarToBankTransfer(tx) {

    if (tx.bloodUnit.bloodDonated) {
        throw new Error('Blood unit is already donated');
    }
    const person = tx.bloodUnit.owner;
    person.points++;

    tx.bloodUnit.owner = tx.bank;

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('blood.donation.assets.BloodUnit');
    // Update the asset in the asset registry.
    await assetRegistry.update(tx.bloodUnit);

    // Get the participant registry for the participant.
    const participantRegistry = await getParticipantRegistry('blood.donation.assets.Person');
    // Update the participant in the participant registry.
    await participantRegistry.update(person);

}

/**
 *
 * @param {blood.donation.assets.BankToReceiverTransfer} tx
 * @transaction
 */
async function BankToReceiverTransfer(tx) {

    if (tx.bloodUnit.bloodGroup !== tx.receiver.bloodGroup) {
        throw new Error('Blood Group not matched');
    }

    if (tx.bloodUnit.bloodDonated) {
        throw new Error('Blood unit is already donated');
    }
    tx.bloodUnit.bloodDonated = true;

    tx.bloodUnit.owner = tx.receiver;
    tx.receiver.points--;

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('blood.donation.assets.BloodUnit');
    // Update the asset in the asset registry.
    await assetRegistry.update(tx.bloodUnit);

    // Get the participant registry for the participant.
    const participantRegistry = await getParticipantRegistry('blood.donation.assets.Person');
    // Update the participant in the participant registry.
    await participantRegistry.update(tx.receiver);
}