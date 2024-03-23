-- PROCEDURE: public.hard_delete_app_user(integer)

DROP PROCEDURE IF EXISTS public.hard_delete_app_user(integer);

CREATE OR REPLACE PROCEDURE public.hard_delete_app_user(
	IN appuserid integer)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    profile_id INT;
BEGIN
    -- Retrieve the profileId associated with the provided appUserId
    SELECT "profileId" INTO profile_id FROM app_user WHERE id = appUserId;

    -- Delete from address, contact_info, team_members_app_user, task
    DELETE FROM address WHERE "appUserId" = appUserId;
    DELETE FROM contact_info WHERE "appUserId" = appUserId;
	DELETE FROM role WHERE "appUserId" = appUserId;
    DELETE FROM team_members_app_user WHERE "appUserId" = appUserId;
    DELETE FROM task WHERE "workerId" = appUserId;

    -- Delete from app_user
    DELETE FROM app_user WHERE id = appUserId;

	-- Finally, delete the corresponding profile row
    DELETE FROM profile WHERE id = profile_id;
END;
$BODY$;
ALTER PROCEDURE public.hard_delete_app_user(integer)
    OWNER TO postgres;
